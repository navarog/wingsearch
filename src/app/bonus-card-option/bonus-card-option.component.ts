import { Component, OnInit, Input } from '@angular/core'
import { BonusCard } from '../store/app.interfaces'

@Component({
  selector: 'app-bonus-card-option',
  templateUrl: './bonus-card-option.component.html',
  styleUrls: ['./bonus-card-option.component.scss']
})
export class BonusCardOptionComponent implements OnInit {

  @Input()
  card: BonusCard

  constructor() { }

  ngOnInit(): void {
  }

  getPointConditions(): { value: string, point: boolean }[][] {
    return this.card.VP.split(';').reduce((acc, condition) => {
      const match = condition.match(/[0-9]+\[point\]/)

      if (!match)
        return acc
      if (!match.index)
        return [...acc, [{ value: match[0], point: true }, { value: condition.slice(match[0].length) + ' ', point: false }]]
      else
        return [...acc, [{ value: condition.slice(0, match.index), point: false }, { value: match[0], point: true }]]
    }, [])
  }
}
