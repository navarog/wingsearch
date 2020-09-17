import { Component, OnInit, Input } from '@angular/core'
import { BonusCard } from '../store/app.interfaces'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-bonus-card',
  templateUrl: './bonus-card.component.html',
  styleUrls: ['./bonus-card.component.scss']
})
export class BonusCardComponent implements OnInit {

  @Input()
  card: BonusCard

  @Input()
  cardHeight$: Observable<number>

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getPointConditions(): {value: string, point: boolean}[][] {
    return this.card.VP.split(';').reduce((acc, condition) => {
      const match = condition.match(/[0-9]+\[point\]/)

      if (!match)
        return acc
      if (!match.index)
        return [...acc, [{ value: match[0], point: true }, { value: condition.slice(match[0].length), point: false }]]
      else
        return [...acc, [{ value: condition.slice(0, match.index), point: false }, { value: match[0], point: true }]]
    }, [])
  }
}
