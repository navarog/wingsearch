import { Component, OnInit, Input } from '@angular/core';
import { BirdCard } from '../store/app.interfaces';

@Component({
  selector: 'app-bird-card',
  templateUrl: './bird-card.component.html',
  styleUrls: ['./bird-card.component.scss']
})
export class BirdCardComponent implements OnInit {

  @Input()
  card: BirdCard

  constructor() { }

  ngOnInit(): void {
  }

}
