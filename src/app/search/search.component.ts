import { Component, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { search, bonusCardSearch, changeLanguage, resetLanguage } from '../store/app.actions'
import { AppState, BonusCard } from '../store/app.interfaces'
import { Observable } from 'rxjs'
import { Options } from 'ng5-slider'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { CookiesService } from '../cookies.service'
import { MatDialog } from '@angular/material/dialog'
import { LanguageDialogComponent } from './language-dialog/language-dialog.component'
import { AnalyticsService } from '../analytics.service'
import { access } from 'fs'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  readonly supportedLanguages = [
    { value: 'en', display: 'English' },
    { value: 'nl', display: 'Dutch' },
    { value: 'fr', display: 'French' },
    { value: 'de', display: 'German' },
    { value: 'pl', display: 'Polish' },
    { value: 'es', display: 'Spanish' },
    { value: 'tr', display: 'Turkish' },
  ]

  readonly supportedExpansions = [
    { value: 'asia', display: 'Asia' },
    { value: 'oceania', display: 'Oceania expansion' },
    { value: 'european', display: 'European expansion' },
    { value: 'swiftstart', display: 'Swift-start pack' },
    { value: 'originalcore', display: 'Base game' },
  ]

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
      asia: true,
      oceania: true,
      european: true,
      swiftstart: true,
      originalcore: true,
    },
    eggs: {
      min: 0,
      max: 6
    },
    points: {
      min: 0,
      max: 9
    },
    wingspan: {
      min: 0,
      max: 500
    },
    foodCost: {
      min: 0,
      max: 3
    },
    colors: {
      brown: true,
      pink: true,
      white: true,
      teal: true,
      yellow: true
    },
    food: {
      invertebrate: false,
      seed: false,
      fruit: false,
      fish: false,
      rodent: false,
      nectar: false,
      'no-food': false,
      'wild (food)': false
    },
    nest: {
      Bowl: true,
      Cavity: true,
      Ground: true,
      None: true,
      Platform: true,
      Wild: true
    }
  }

  bonusControl = new FormControl()

  filteredBonusCards: Observable<BonusCard[]>
  bonusCards: Observable<BonusCard[]>

  canFitStats: boolean

  eggOptions: Options = {
    showTicksValues: true,
    stepsArray: Array.from(Array(7).keys()).map(key => ({ value: key }))
  }

  pointOptions: Options = {
    showTicksValues: true,
    stepsArray: Array.from(Array(10).keys()).map(key => ({ value: key }))
  }

  wingspanOptions: Options = {
    showTicksValues: true,
    stepsArray: [0, 20, 30, 50, 75, 100, 150, 500].map(key => ({ value: key })),
    translate: value => {
      if (value === 0) { return 'min'; }
      else if (value === 500) { return 'max'; }
      else { return value.toString(); }
    }
  }

  foodCostOptions: Options = {
    showTicksValues: true,
    stepsArray: Array.from(Array(4).keys()).map(key => ({ value: key })),
  }

  eggs = {
    min: 0,
    max: 6
  }

  points = {
    min: 0,
    max: 9
  }

  wingspan = {
    min: 0,
    max: 500
  }

  foodCost = {
    min: 0,
    max: 3
  }

  language = 'en'
  selectedExpansions = ['asia', 'oceania', 'european', 'originalcore', 'swiftstart']

  @ViewChild(MatAutocompleteTrigger)
  autocomplete: MatAutocompleteTrigger

  constructor(
    private store: Store<{ app: AppState }>,
    private cookies: CookiesService,
    public dialog: MatDialog,
    private analytics: AnalyticsService
  ) {
    this.filteredBonusCards = this.store.select(({ app }) => app.activeBonusCards)
    this.bonusCards = this.store.select(({ app }) => app.bonusCards)
    this.query = {
      ...this.query,
      expansion: {
        asia: cookies.getCookie('expansion.asia') !== '0',
        oceania: cookies.getCookie('expansion.oceania') !== '0',
        european: cookies.getCookie('expansion.european') !== '0',
        swiftstart: cookies.getCookie('expansion.swiftstart') !== '0',
        originalcore: cookies.getCookie('expansion.core') !== '0',
      }
    }

    this.selectedExpansions = Object.entries(this.query.expansion).reduce((acc, entry) => entry[1] ? [...acc, entry[0]] : acc, [])
    store.dispatch(search(this.query))
  }

  ngOnInit(): void {
    this.canFitStats = window.innerWidth >= 600
    this.bonusControl.valueChanges.subscribe(() => this.onBonusChange())
    if (this.cookies.hasConsent())
      this.language = this.cookies.getCookie('language') || this.language
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
    this.wingspan = { min: 0, max: 500 }
    this.foodCost = { min: 0, max: 3 }
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
      wingspan: { ...this.wingspan },
      foodCost: { ...this.foodCost },
      colors: { brown: true, pink: true, white: true, teal: true, yellow: true },
      food: { invertebrate: false, seed: false, fruit: false, fish: false, rodent: false, nectar: false, 'wild (food)': false, 'no-food': false },
      nest: { Bowl: true, Cavity: true, Ground: true, None: true, Platform: true, Wild: true }
    }
    this.bonusControl.setValue('')
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

  onWingspanChange() {
    this.query = { ...this.query, wingspan: { ...this.wingspan } }
    this.onQueryChange()
  }

  onFoodCostChange() {
    this.query = { ...this.query, foodCost: { ...this.foodCost } }
    this.onQueryChange()
  }

  addBonus(event: MatAutocompleteSelectedEvent) {
    this.query = { ...this.query, bonus: [...this.query.bonus, event.option.value] }
    this.bonusControl.setValue('')
    this.onBonusChange()
    this.onQueryChange()
  }

  removeBonus(bonus: number) {
    this.query = { ...this.query, bonus: this.query.bonus.filter(id => id !== bonus) }
    this.onBonusChange()
    this.onQueryChange()
  }

  openPanel() {
    this.autocomplete.openPanel()
  }

  togglePower(color: string) {
    this.query = { ...this.query, colors: { ...this.query.colors, [color]: !this.query.colors[color] } }
    this.onQueryChange()
  }

  toggleFood(food: string) {
    this.query = { ...this.query, food: { ...this.query.food, [food]: !this.query.food[food] } }
    this.onQueryChange()
  }

  toggleNest(nest: string) {
    this.query = { ...this.query, nest: { ...this.query.nest, [nest]: !this.query.nest[nest] } }
    this.onQueryChange()
  }

  languageChange(language: string) {
    if (language === 'en') {
      this.cookies.deleteCookie('language')
      this.store.dispatch(resetLanguage())
    } else {
      this.cookies.setCookie('language', language, 180)
      this.store.dispatch(changeLanguage({ language }))
    }

    this.analytics.setLanguage(language)
  }

  openLanguageDialog() {
    this.dialog.open(LanguageDialogComponent, { closeOnNavigation: true, maxWidth: 'min(700px, 80vw)' })
  }

  expansionChange(selectedExpansions: string[]) {
    this.query = {
      ...this.query,
      // @ts-ignore
      expansion: {
        ...Object.keys(this.query.expansion).reduce((acc, val) => ({ ...acc, [val]: false }), {}),
        ...selectedExpansions.reduce((acc, val) => ({ ...acc, [val]: true }), {})
      }
    }

    Object.entries(this.query.expansion).forEach(entry =>
      this.cookies.setCookie(`expansion.${entry[0]}`, entry[1] ? '1' : '0', 365)
    )

    this.onBonusChange()
    this.onQueryChange()
  }
}
