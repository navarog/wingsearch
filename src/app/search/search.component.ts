import { Component, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { search, bonusCardSearch } from '../store/app.actions'
import { AppState, BonusCard } from '../store/app.interfaces'
import { Observable } from 'rxjs'
import { Options } from 'ng5-slider'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { CookiesService } from '../cookies.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = {
    main: '',
    bonus: [],
    stats: {
      habitat: {
        forest: true,
        grassland: true,
        wetland: true
      },
      birds: true,
      bonuses: true
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
    },
    colors: {
      brown: true,
      pink: true,
      white: true,
      teal: true
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

  @ViewChild(MatAutocompleteTrigger)
  autocomplete: MatAutocompleteTrigger

  constructor(private store: Store<{ app: AppState }>, private cookies: CookiesService) {
    this.filteredBonusCards = this.store.select(({ app }) => app.activeBonusCards)
    this.query = {
      ...this.query,
      expansion: {
        european: cookies.getCookie('expansion.european') !== '0'
      }
    }
    store.dispatch(search(this.query))
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

  onStatsChange(stats) {
    this.query.stats = stats
    this.onQueryChange()
  }

  clearFilter() {
    this.eggs = { min: 0, max: 6 }
    this.points = { min: 0, max: 9 }
    this.query = {
      ...this.query,
      main: '',
      bonus: [],
      stats: {
        habitat: { forest: true, grassland: true, wetland: true },
        birds: true,
        bonuses: true
      },
      eggs: { ...this.eggs },
      points: { ...this.points },
      colors: { brown: true, pink: true, white: true, teal: true}
    }
    this.bonusControl.setValue('')
    this.onBonusChange()
    this.onQueryChange()
  }

  toggleExpansion(expansion: 'european') {
    this.query = { ...this.query, expansion: { ...this.query.expansion, [expansion]: !this.query.expansion[expansion] } }
    this.cookies.setCookie(`expansion.${expansion}`, this.query.expansion[expansion] ? '1' : '0', 365)
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
    this.query = { ...this.query, bonus: [...this.query.bonus, event.option.value] }
    this.bonusControl.setValue('')
    this.onBonusChange()
    this.onQueryChange()
  }

  removeBonus(bonus: string) {
    this.query = { ...this.query, bonus: this.query.bonus.filter(name => name !== bonus) }
    this.onBonusChange()
    this.onQueryChange()
  }

  openPanel() {
    this.autocomplete.openPanel()
  }

  togglePower(color: string) {
    this.query = { ...this.query, colors: { ...this.query.colors, [color]: !this.query.colors[color]}}
    this.onQueryChange()
  }
}
