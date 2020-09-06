import { Component, OnInit, Input } from '@angular/core'
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

  stats$: Observable<DisplayedStats>

  constructor(store: Store<{ app: AppState }>) {
    this.stats$ = store.select(({ app }) => app.displayedStats)
   }

  ngOnInit(): void {
  }

}
