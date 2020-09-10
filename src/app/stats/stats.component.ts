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
  habitatControls: { forest: boolean, grassland: boolean, wetland: boolean }

  @Output()
  statsChange = new EventEmitter()

  stats$: Observable<DisplayedStats>

  constructor(store: Store<{ app: AppState }>) {
    this.stats$ = store.select(({ app }) => app.displayedStats)
  }

  ngOnInit(): void {
  }

  toggleStats(habitat: 'forest' | 'grassland' | 'wetland', event: MouseEvent) {
    event.cancelBubble = true
    this.statsChange.emit({...this.habitatControls, [habitat]: !this.habitatControls[habitat]})
  }
}
