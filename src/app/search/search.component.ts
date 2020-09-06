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
  }

  bonusfield = ''

  filteredBonusCards: Observable<BonusCard[]>

  constructor(private store: Store<{ app: AppState }>) {
    this.filteredBonusCards = this.store.select(({ app }) => app.activeBonusCards)
  }

  ngOnInit(): void {
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
}
