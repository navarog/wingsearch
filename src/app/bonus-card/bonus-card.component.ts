import { Component, OnInit, Input } from '@angular/core'
import { BonusCard } from '../store/app.interfaces'
import { MatDialog } from '@angular/material/dialog'
import { CardDetailComponent } from '../card-detail/card-detail.component'

@Component({
  selector: 'app-bonus-card',
  templateUrl: './bonus-card.component.html',
  styleUrls: ['./bonus-card.component.scss']
})
export class BonusCardComponent implements OnInit {

  @Input()
  card: BonusCard

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(CardDetailComponent, {
      data: { card: this.card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: true
    })
  }
}
