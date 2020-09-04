import { Component, OnInit, Input } from '@angular/core'
import { BonusCard } from '../store/app.interfaces'

@Component({
  selector: 'app-bonus-card',
  templateUrl: './bonus-card.component.html',
  styleUrls: ['./bonus-card.component.scss']
})
export class BonusCardComponent implements OnInit {

  @Input()
  card: BonusCard

  constructor() { }

  ngOnInit(): void {
  }

}
