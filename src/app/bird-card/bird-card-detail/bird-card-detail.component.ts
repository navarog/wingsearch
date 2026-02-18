import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppState, BirdCard, BonusCard } from 'src/app/store/app.interfaces'
import { bonusSearchMap } from 'src/app/store/bonus-search-map'
import { DomSanitizer } from '@angular/platform-browser'
import * as appActions from '../../store/app.actions'

@Component({
  selector: 'app-bird-card-detail',
  templateUrl: './bird-card-detail.component.html',
  styleUrls: ['./bird-card-detail.component.scss']
})
export class BirdCardDetailComponent implements OnInit, AfterViewInit, OnDestroy {

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: BirdCard },
    private store: Store<{ app: AppState }>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
    this.initBonuses()
    // No need to pause playlist - audio is now managed by playlist service
    // Card detail just displays info while playlist continues playing
  }

  initBonuses() {
    this.bonusCards$ = this.store.pipe(
      select(({ app }) => app.bonusCards),
      map(cards => {
        const filteredCards = cards.filter(card => card['VP Average'] && bonusSearchMap[card.id].callbackfn(this.data.card))
        filteredCards.sort((a, b) => b['VP Average'] - a['VP Average'])
        return filteredCards
      })
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
          return {}
        else
          return { 'border-bottom-left-radius.px': height * 0.025, 'border-bottom-right-radius.px': height * 0.025 }
      })
    )
  }


  ngOnDestroy(): void {
    // No need to manage audio - playlist service handles everything
  }
}
