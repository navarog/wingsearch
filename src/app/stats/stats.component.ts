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
    habitat: { forest: number, grassland: number, wetland: number }
    birds: boolean,
    bonuses: boolean,
    hummingbirds: boolean
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
    event.stopPropagation()

    const newStats = {
      ...this.statsControls,
      habitat: {
        ...this.statsControls.habitat,
        [habitat]: (this.statsControls.habitat[habitat] + 1) % 3
      }
    }

    this.statsChange.emit(newStats)
  }

  toggleCards(cards: 'birds' | 'bonuses' | 'hummingbirds', event: MouseEvent) {
    event.stopPropagation()

    const newStats = {
      ...this.statsControls,
      habitat: {
        ...this.statsControls.habitat,
      },
      [cards]: !this.statsControls[cards]
    }

    this.statsChange.emit(newStats)
  }
}
