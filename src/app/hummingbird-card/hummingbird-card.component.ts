import { Component, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store'
import { BirdCard, AppState, GroupType, BenefitType } from '../store/app.interfaces'
import { TranslatePipe } from '../translate.pipe'
import EasterEggAssets from '../../assets/data/extra-assets.json'

@Component({
  selector: 'app-hummingbird-card',
  templateUrl: './hummingbird-card.component.html',
  styleUrls: ['./hummingbird-card.component.scss']
})
export class HummingbirdCardComponent implements OnInit {

  @Input()
  card: BirdCard

  @Input()
  cardHeight$: Observable<number>

  assetPack$: Observable<string>

  parameters$: { [key: string]: { Value: unknown }}

  constructor(
    private translate: TranslatePipe,
    private store: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.assetPack$ = this.store.select(({ app }) => app.assetPack);
    this.store.select(({ app }) => app.parameters)
      .subscribe(parameters =>
      {
        this.parameters$ = parameters
      })
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
      if (!!card.Photographer) {
        bonusIcons += ' [photographer]';
      }
    }
    return card['Common name'] + " " + bonusIcons;
  }

  getGroupIcon() {
    const groupMap = {
      [GroupType.Bee]: 'bee',
      [GroupType.Brilliant]: 'brilliant',
      [GroupType.Emerald]: 'emerald',
      [GroupType.Mango]: 'mango',
      [GroupType.Topaz]: 'topaz'
    }

    return this.translate.transform(groupMap[this.card.Group]);
  }

  getBenefitIcon() {
    return this.card.Benefit === BenefitType.Row ? 'row_benefit' : this.card.Benefit
  }
}
