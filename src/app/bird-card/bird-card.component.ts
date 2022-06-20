import { Component, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { BirdCard } from '../store/app.interfaces'
import { TranslatePipe } from '../translate.pipe'

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

  habitats: string[]
  eggs: any[]
  powerTitle = '<span class="intro">[power][text]: </span>'

  constructor(private translate: TranslatePipe) { }

  ngOnInit(): void {
    this.habitats = ['Wetland', 'Grassland', 'Forest'].filter(h => this.card[h])
    this.eggs = Array(this.card['Egg capacity'])
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
    const escapePower = (power: string) => power ? `[${power.toLowerCase()}]` : ''
    const powerKeys = ['Predator', 'Flocking']
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
    return `background-image: url(assets/cards/birds/${this.card.id}.webp)`
  }
}
