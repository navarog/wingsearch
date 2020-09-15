import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { BirdCard } from '../store/app.interfaces'

@Component({
  selector: 'app-bird-card',
  templateUrl: './bird-card.component.html',
  styleUrls: ['./bird-card.component.scss']
})
export class BirdCardComponent implements OnInit {

  @Input()
  card: BirdCard

  habitats: string[]
  eggs: any[]
  nest: 'string'

  constructor() { }

  ngOnInit(): void {
    this.habitats = ['Wetland', 'Grassland', 'Forest'].filter(h => this.card[h])
    this.eggs = Array(this.card['Egg capacity'])
    this.nest = this.resolveNestType()
  }

  buildFoodCostString() {
    const food = {
      invertebrate: this.card.Invertebrate,
      seed: this.card.Seed,
      fruit: this.card.Fruit,
      fish: this.card.Fish,
      rodent: this.card.Rodent,
      wild: this.card['Wild (food)']
    }

    return (this.card['* (food cost)'] ? '*' : '') + Object.entries(food)
      .reduce((acc, val) => ([...acc, ...Array.from({ length: val[1] }, () => `[${val[0]}]`)]), [])
      .join(this.card['/ (food cost)'] ? '/' : '+')
  }

  resolveNestType() {
    const nestMap = {Wild: 'star', None: null}

    return nestMap[this.card['Nest type']] || this.card['Nest type'].toLowerCase()
  }
}
