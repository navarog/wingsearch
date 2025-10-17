import { Component, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store'
import { BirdCard, AppState, ExpansionType, PackType } from '../store/app.interfaces'
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

  constructor(
    private translate: TranslatePipe,
    private store: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.habitats = ['Wetland', 'Grassland', 'Forest'].filter(h => this.card[h])
    this.eggs = Array(this.card['Egg limit'])
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
    const nestMap = { wild: 'star', none: null }

    return Object.keys(nestMap).includes(this.card['Nest type']) ? nestMap[this.card['Nest type']] : this.card['Nest type'].toLowerCase()
  }

  getPowerTitle() {
    const powerMap = {
      Predator: '[predator]',
      Flocking: '[flocking]',
      'Bonus card': '[bonus_cards]'
    }
    const textMap = {
      brown: 'WHEN ACTIVATED',
      white: 'WHEN PLAYED',
      pink: 'ONCE BETWEEN TURNS',
      teal: 'ROUND END',
      yellow: 'GAME END'
    }

    const power = Object.entries(powerMap).map(([key, value]) => this.card[key] ? value : '').join('');
    const text = this.translate.transform(textMap[this.card.Color]);
    return `<span class="intro">${power}${text}: </span>`;
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

  displayName(card: BirdCard): string {
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

  isExpansion(): boolean {
    const packNames: string[] = Object.values(ExpansionType);
    return packNames.includes(this.card.Set)
  }

  getSwiftStartIcon(): string {
    const iconMap = {
      [ExpansionType.Core]: 'swiftstart',
      [ExpansionType.Asia]: 'swiftstart-asia',
    }
    return this.card['Swift Start'] ? iconMap[this.card.Set] || '' : ''
  }

  isPromo(): boolean {
    const packNames: string[] = Object.values(PackType);
    return packNames.includes(this.card.Set)
  }

  getPackTitle() {
    const packTitleMap = {
      promoAsia: 'Additional Asian Avians',
      promoUK: 'British Birds',
      promoCA: 'Birds of Canada / Oiseaux du Canada',
      promoEurope: 'Birds of Continental Europe',
      promoNZ: 'Birds of New Zealand / Ngā Manu o Aotearoa',
      promoUS: 'Birds of U.S.A.'
    }

    return this.translate.transform(packTitleMap[this.card.Set]);
  }
}
