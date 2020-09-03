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
    this.store.dispatch(bonusCardSearch(this.query))
  }

  onKeyDown(event: KeyboardEvent) {
    event.cancelBubble = true
    console.log(event)
    if (event.key === ' ') {
      this.query.bonus += ' '
    }
  }
}
