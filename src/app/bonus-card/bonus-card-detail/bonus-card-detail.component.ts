import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, Observable } from 'rxjs'
import { first, flatMap, map, tap } from 'rxjs/operators'
import { AppState, BirdCard, BonusCard } from 'src/app/store/app.interfaces'
import { bonusSearchMap, dynamicPercentage } from 'src/app/store/bonus-search-map'

@Component({
  selector: 'app-bonus-card-detail',
  templateUrl: './bonus-card-detail.component.html',
  styleUrls: ['./bonus-card-detail.component.scss']
})
export class BonusCardDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef
  @ViewChild('cardWrapper', { read: ElementRef })
  cardWrapper: ElementRef
  @ViewChild('carousel', { read: ElementRef })
  carousel: ElementRef

  layout: 'desktop' | 'mobile'
  cardHeight$ = new BehaviorSubject<number>(0)
  bonusCardHeight$ = new BehaviorSubject<number>(0)
  bonusCards$: Observable<BonusCard[]>
  birds: BirdCard[]
  compatibleBirdIds: number[]


  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: BonusCard }, private store: Store<{ app: AppState }>) { }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
    this.initBonuses()
  }

  initBonuses() {
    this.bonusCards$ = this.store.pipe(
      select(({ app }) => app.birdCards),
      first(),
      tap(birds => {
        this.birds = birds
        this.compatibleBirdIds = birds.filter((bird) => bonusSearchMap[this.data.card.id].callbackfn(bird)).map(bird => bird.id)
      }),
      flatMap(() => this.store.select(({ app }) =>app.bonusCards.map(dynamicPercentage(this.birds, app.expansion)))),
      map(cards => cards.filter(card => card['VP Average'] && card.id !== this.data.card.id)
        .map(bonus => ({
          ...bonus,
          birdIds: this.birds.filter((bird) => bonusSearchMap[bonus.id].callbackfn(bird))
            .map(bird => bird.id).filter(id => this.compatibleBirdIds.includes(id))
        }))
        .filter(bonus => bonus.birdIds.length).
        sort((a, b) => b.birdIds.length * b['VP Average'] - a.birdIds.length * a['VP Average'])
      )
    )
    this.cardWrapper?.nativeElement.scroll(0, 0)
    this.carousel?.nativeElement.scroll(0, 0)
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
    setTimeout(() => this.bonusCardHeight$.next(this.calcBonusCardHeight()), 0)
  }

  calcBonusCardHeight(): number {
    return (this.layout === 'desktop') ? window.innerWidth / 5 * 1.50 : this.cardHeight$.value
  }

  onResize(event) {
    this.layout = this.calculateLayout(event.target.innerWidth)
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
    setTimeout(() => this.bonusCardHeight$.next(this.calcBonusCardHeight()), 0)
  }

  calculateLayout(width): 'desktop' | 'mobile' {
    if (width < 600)
      return 'mobile'
    else
      return 'desktop'
  }

  bonusCardStyle(i: number) {
    return this.bonusCardHeight$.pipe(
      map(height => {
        const styles = { 'height.px': height, 'z-index': i }
        if (this.layout === 'desktop')
          return { 'border-radius.px': height * 0.025, ...styles }
        else
          return { 'border-top-left-radius.px': height * 0.025, 'border-top-right-radius.px': height * 0.025, ...styles }
      })
    )
  }

  cardStatsStyle() {
    return this.bonusCardHeight$.pipe(
      map(height => {
        if (this.layout === 'desktop')
          return { }
        else
          return { 'border-bottom-left-radius.px': height * 0.025, 'border-bottom-right-radius.px': height * 0.025 }
      })
    )
  }
}
