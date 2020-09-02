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

  cards: Observable<(BirdCard | BonusCard)[]>

  constructor(private store: Store<{ app: AppState }>) {
    this.cards = this.store.select(({ app }) => app.displayedCards)
  }

  ngOnInit(): void {

  }

  isBirdCard(card: BirdCard | BonusCard): card is BirdCard {
    return isBirdCard(card)
  }

  isBonusCard(card: BirdCard | BonusCard): card is BonusCard {
    return isBonusCard(card)
  }

}
