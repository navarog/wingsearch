import { Component, OnInit, Input } from '@angular/core'
import { BonusCard } from '../store/app.interfaces'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-bonus-card-option',
  templateUrl: './bonus-card-option.component.html',
  styleUrls: ['./bonus-card-option.component.scss']
})
export class BonusCardOptionComponent implements OnInit {

  @Input()
  card: BonusCard

  baseHref = environment.baseHref

  constructor() { }

  ngOnInit(): void {
  }

}
