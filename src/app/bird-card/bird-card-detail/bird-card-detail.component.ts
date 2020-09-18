import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppState, BirdCard, BonusCard } from 'src/app/store/app.interfaces'
import { bonusSearchMap } from 'src/app/store/bonus-search-map'

@Component({
  selector: 'app-bird-card-detail',
  templateUrl: './bird-card-detail.component.html',
  styleUrls: ['./bird-card-detail.component.scss']
})
export class BirdCardDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  layout: 'desktop' | 'mobile'
  cardHeight$ = new BehaviorSubject<number>(0)
  bonusCardHeight$ = new BehaviorSubject<number>(0)
  bonusCards$: Observable<BonusCard[]>

  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: BirdCard }, private store: Store<{ app: AppState }>) { }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
    this.bonusCards$ = this.store.pipe(
      select(({ app }) => app.bonusCards),
      map(cards => {
        const filteredCards = cards.filter(card => card['VP Average'] && bonusSearchMap[card.id](this.data.card))
        filteredCards.sort((a, b) => b['VP Average'] - a['VP Average'])
        return filteredCards
      })
    )
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
}
