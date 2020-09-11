import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { search, bonusCardSearch } from '../store/app.actions'
import { AppState, BonusCard } from '../store/app.interfaces'
import { Observable } from 'rxjs'
import { Options } from 'ng5-slider'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = {
    main: '',
    bonus: [],
    habitat: {
      forest: true,
      grassland: true,
      wetland: true
    },
    expansion: {
      european: true
    },
    eggs: {
      min: 0,
      max: 6
    },
    points: {
      min: 0,
      max: 9
    }
  }

  bonusControl = new FormControl()

  filteredBonusCards: Observable<BonusCard[]>

  canFitStats: boolean

  eggOptions: Options = {
    showTicksValues: true,
    stepsArray: Array.from(Array(7).keys()).map(key => ({ value: key }))
  }

  pointOptions: Options = {
    showTicksValues: true,
    stepsArray: Array.from(Array(10).keys()).map(key => ({ value: key }))
  }

  eggs = {
    min: 0,
    max: 6
  }

  points = {
    min: 0,
    max: 9
  }

  constructor(private store: Store<{ app: AppState }>) {
    this.filteredBonusCards = this.store.select(({ app }) => app.activeBonusCards)
  }

  ngOnInit(): void {
    this.canFitStats = window.innerWidth >= 600
    this.bonusControl.valueChanges.subscribe(() => this.onBonusChange())
  }

  onQueryChange() {
    this.store.dispatch(search(this.query))
  }

  onBonusChange() {
    this.store.dispatch(bonusCardSearch({ bonus: this.query.bonus, bonusfield: this.bonusControl.value, expansion: this.query.expansion }))
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.cancelBubble = true
    }
  }

  onResize() {
    this.canFitStats = window.innerWidth >= 600
  }

  onStatsChange(habitatControls) {
    this.query.habitat = habitatControls
    this.onQueryChange()
  }

  clearFilter() {
    this.eggs = { min: 0, max: 6 }
    this.points = { min: 0, max: 9 }
    this.query = {
      ...this.query,
      main: '',
      bonus: [],
      habitat: { forest: true, grassland: true, wetland: true },
      eggs: { ...this.eggs },
      points: { ...this.points }
    }
    this.bonusControl.setValue('')
    this.onBonusChange()
    this.onQueryChange()
  }

  toggleExpansion(expansion: 'european') {
    this.query = { ...this.query, expansion: { ...this.query.expansion, [expansion]: !this.query.expansion[expansion] } }
    this.onBonusChange()
    this.onQueryChange()
  }

  onEggsChange() {
    this.query = { ...this.query, eggs: { ...this.eggs } }
    this.onQueryChange()
  }

  onPointsChange() {
    this.query = { ...this.query, points: { ...this.points } }
    this.onQueryChange()
  }

  addBonus(event: MatAutocompleteSelectedEvent) {
    this.query = {...this.query, bonus: [...this.query.bonus, event.option.value]}
    this.bonusControl.setValue('')
    this.onBonusChange()
    this.onQueryChange()
  }

  removeBonus(bonus: string) {
    this.query = {...this.query, bonus: this.query.bonus.filter(name => name !== bonus)}
    this.onBonusChange()
    this.onQueryChange()
  }
}
