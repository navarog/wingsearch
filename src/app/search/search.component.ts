import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { search, bonusCardSearch } from '../store/app.actions'
import { AppState, BonusCard } from '../store/app.interfaces'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = {
    main: '',
    bonus: '',
    habitat: {
      forest: true,
      grassland: true,
      wetland: true
    }
  }

  bonusfield = ''

  filteredBonusCards: Observable<BonusCard[]>

  canFitStats: boolean

  constructor(private store: Store<{ app: AppState }>) {
    this.filteredBonusCards = this.store.select(({ app }) => app.activeBonusCards)
  }

  ngOnInit(): void {
    this.canFitStats = window.innerWidth >= 600
  }

  onQueryChange() {
    this.store.dispatch(search(this.query))
  }

  onBonusChange() {
    this.query.bonus = ''
    this.onQueryChange()
    this.store.dispatch(bonusCardSearch({ bonus: this.bonusfield }))
  }

  onKeyDown(event: KeyboardEvent) {
    event.cancelBubble = true
    if (event.key === ' ') {
      this.query.bonus += ' '
    }
  }

  onResize() {
    this.canFitStats = window.innerWidth >= 600
  }

  onStatsChange(habitatControls) {
    this.query.habitat = habitatControls
    this.onQueryChange()
  }
}
