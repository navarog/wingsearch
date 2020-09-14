import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs'
import { DisplayedStats, AppState } from '../store/app.interfaces'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @Input()
  mobile: boolean

  @Input()
  statsControls: {
    habitat: { forest: boolean, grassland: boolean, wetland: boolean }
    birds: boolean,
    bonuses: boolean
  }

  @Output()
  statsChange = new EventEmitter()

  stats$: Observable<DisplayedStats>

  constructor(store: Store<{ app: AppState }>) {
    this.stats$ = store.select(({ app }) => app.displayedStats)
  }

  ngOnInit(): void {
  }

  toggleHabitat(habitat: 'forest' | 'grassland' | 'wetland', event: MouseEvent) {
    event.cancelBubble = true

    const newStats = {
      ...this.statsControls,
      habitat: {
        ...this.statsControls.habitat,
        [habitat]: !this.statsControls.habitat[habitat]
      }
    }
    newStats.birds = Object.values(newStats.habitat).reduce((a, b) => a || b, false)

    this.statsChange.emit(newStats)
  }

  toggleCards(cards: 'birds' | 'bonuses', event: MouseEvent) {
    event.cancelBubble = true

    const newStats = {
      ...this.statsControls,
      habitat: {
        ...this.statsControls.habitat,
      },
      [cards]: !this.statsControls[cards]
    }
    if (cards === 'birds')
      newStats.habitat = {
        forest: newStats.birds,
        grassland: newStats.birds,
        wetland: newStats.birds
      }

    this.statsChange.emit(newStats)
  }
}
