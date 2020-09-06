import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState, BirdCard, BonusCard, isBirdCard, isBonusCard } from '../store/app.interfaces'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  cards$: Observable<(BirdCard | BonusCard)[]>

  private readonly CARD_MINIMUM_WIDTH = 165

  private readonly MAX_DISPLAY_COLUMNS = 6

  constructor(private store: Store<{ app: AppState }>) {
    this.cards$ = this.store.select(({ app }) => app.displayedCards)
  }

  columns: number

  ngOnInit(): void {
    this.columns = this.calculateColumns(window.innerWidth)
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
  }
}
