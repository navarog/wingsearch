import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BonusCard } from 'src/app/store/app.interfaces';

@Component({
  selector: 'app-bonus-card-detail',
  templateUrl: './bonus-card-detail.component.html',
  styleUrls: ['./bonus-card-detail.component.scss']
})
export class BonusCardDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  layout: 'desktop' | 'mobile'
  cardHeight$ = new BehaviorSubject<number>(0)

  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: BonusCard }) { }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
  }

  onResize(event) {
    this.layout = this.calculateLayout(event.target.innerWidth)
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
  }

  calculateLayout(width): 'desktop' | 'mobile' {
    if (width < 600)
      return 'mobile'
    else
      return 'desktop'
  }
}
