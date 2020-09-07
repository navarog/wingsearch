import { Component, OnInit, Input } from '@angular/core'
import { BirdCard } from '../store/app.interfaces'
import { MatDialog } from '@angular/material/dialog'
import { CardDetailComponent } from '../card-detail/card-detail.component'

@Component({
  selector: 'app-bird-card',
  templateUrl: './bird-card.component.html',
  styleUrls: ['./bird-card.component.scss']
})
export class BirdCardComponent implements OnInit {

  @Input()
  card: BirdCard

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
