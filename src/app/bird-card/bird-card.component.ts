import { Component, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store'
import { BirdCard, AppState } from '../store/app.interfaces'
import { TranslatePipe } from '../translate.pipe'
import EasterEggAssets from '../../assets/data/extra-assets.json'

@Component({
  selector: 'app-bird-card',
  templateUrl: './bird-card.component.html',
  styleUrls: ['./bird-card.component.scss']
})
export class BirdCardComponent implements OnInit {

  @Input()
  card: BirdCard

  @Input()
  cardHeight$: Observable<number>

  assetPack$: Observable<string>

  parameters$: { [key: string]: { Value: unknown }}

  habitats: string[]
  eggs: any[]
  wingspan: string
  powerTitle = '<span class="intro">[power][text]: </span>'

  constructor(
    private translate: TranslatePipe,
    private store: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.habitats = ['Wetland', 'Grassland', 'Forest'].filter(h => this.card[h])
    this.eggs = Array(this.card['Egg capacity'])
    this.wingspan = this.card['Wingspan'] + (this.card['Wingspan'] !== '*' ? 'cm' : '')
    this.assetPack$ = this.store.select(({ app }) => app.assetPack);
    this.store.select(({ app }) => app.parameters)
      .subscribe(parameters =>
      {
        this.parameters$ = parameters
      })
  }

  buildFoodCostString() {
    const food = {
      invertebrate: this.card.Invertebrate,
      seed: this.card.Seed,
      fruit: this.card.Fruit,
      fish: this.card.Fish,
      rodent: this.card.Rodent,
      nectar: this.card.Nectar,
      wild: this.card['Wild (food)']
    }

    return (this.card['* (food cost)'] ? '*' : '') + Object.entries(food)
      .reduce((acc, val) => ([...acc, ...Array.from({ length: val[1] }, () => `[${val[0]}]`)]), [])
      .join(this.card['/ (food cost)'] ? '/' : '+') || '[no-food]'
  }

  resolveNestType() {
    const nestMap = { Wild: 'star', None: null }

    return Object.keys(nestMap).includes(this.card['Nest type']) ? nestMap[this.card['Nest type']] : this.card['Nest type'].toLowerCase()
  }

  getPowerTitle() {
    const escapePower = (power: string) => power ? `[${power.toLowerCase().replace(' ', '-')}]` : ''
    const powerKeys = ['Predator', 'Flocking', 'Bonus card']
    const textMap = {
      Brown: 'WHEN ACTIVATED',
      White: 'WHEN PLAYED',
      Pink: 'ONCE BETWEEN TURNS',
      Teal: 'ROUND END',
      Yellow: 'GAME END'
    }

    return this.powerTitle
      .replace(/\[power\]/g, escapePower(powerKeys.find(key => this.card[key])))
      .replace(/\[text\]/g, this.translate.transform(textMap[this.card.Color]))
  }

  getBirdSilhouette() {
    return this.assetPack$.pipe(
      map(packName => {
        if (EasterEggAssets[packName] && EasterEggAssets[packName][this.card.id]) {
          return `background-image: url(assets/cards/birds-${packName}/${this.card.id}.webp)`
        } else {
          return `background-image: url(assets/cards/birds/${this.card.id}.webp)`
        }
      })
    )
  }

  displayName(card: BirdCard): string
  {
    const showBonusCardsMatchSymbols: boolean = this.parameters$['Show bonus cards match symbols'].Value as unknown as boolean;
    let bonusIcons = "";
    if (showBonusCardsMatchSymbols) {
      if (!!card.Anatomist) {
        bonusIcons += ' [anatomist]';
      }
      if (!!card.Cartographer) {
        bonusIcons += ' [cartographer]';
      }
      if (!!card.Historian) {
        bonusIcons += ' [historian]';
      }
      if (!!card.Photographer) {
        bonusIcons += ' [photographer]';
      }
    }
    return card['Common name'] + " " + bonusIcons;
  }
}
