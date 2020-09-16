import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState, BirdCard, BonusCard, isBirdCard, isBonusCard } from '../store/app.interfaces'
import { Observable, BehaviorSubject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { CardDetailComponent } from '../card-detail/card-detail.component'
import { scroll } from '../store/app.actions'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  cards$: Observable<(BirdCard | BonusCard)[]>

  private readonly CARD_MINIMUM_WIDTH = 165

  private readonly MAX_DISPLAY_COLUMNS = 6

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  cardHeight$ = new BehaviorSubject<number>(0)

  constructor(private store: Store<{ app: AppState }>, public dialog: MatDialog) {
    this.cards$ = this.store.select(({ app }) => app.displayedCards)
  }

  columns: number

  ngOnInit(): void {
    this.columns = this.calculateColumns(window.innerWidth)
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
  }

  private calculateColumns(width): number {
    return Math.min(Math.floor(width / this.CARD_MINIMUM_WIDTH), this.MAX_DISPLAY_COLUMNS)
  }

  isBirdCard(card: BirdCard | BonusCard): card is BirdCard {
    return isBirdCard(card)
  }

  isBonusCard(card: BirdCard | BonusCard): card is BonusCard {
    return isBonusCard(card)
  }

  onResize(event) {
    this.columns = this.calculateColumns(event.target.innerWidth)
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight))
  }

  openDialog(card: BirdCard | BonusCard) {
    this.dialog.open(CardDetailComponent, {
      data: { card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: true
    })
  }

  onScroll() {
    this.store.dispatch(scroll())
  }
}
