import { Component, OnInit, Input, Inject } from '@angular/core'
import { BirdCard, BonusCard, isBirdCard, isBonusCard } from '../store/app.interfaces'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  layout: 'desktop' | 'mobile' | 'tablet'

  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: BirdCard | BonusCard }) {
  }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
  }

  isBirdCard(card: BirdCard | BonusCard): card is BirdCard {
    return isBirdCard(card)
  }

  isBonusCard(card: BirdCard | BonusCard): card is BonusCard {
    return isBonusCard(card)
  }

  onResize(event) {
    this.layout = this.calculateLayout(event.target.innerWidth)
  }

  calculateLayout(width): 'desktop' | 'mobile' | 'tablet' {
    if (width < 600)
      return 'mobile'

    if (width > 800)
      return 'desktop'

    return 'tablet'
  }
}
