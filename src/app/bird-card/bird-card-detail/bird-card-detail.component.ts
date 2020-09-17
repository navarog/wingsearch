import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { BehaviorSubject } from 'rxjs'
import { BirdCard, BonusCard } from 'src/app/store/app.interfaces'

@Component({
  selector: 'app-bird-card-detail',
  templateUrl: './bird-card-detail.component.html',
  styleUrls: ['./bird-card-detail.component.scss']
})
export class BirdCardDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  layout: 'desktop' | 'mobile'
  cardHeight$ = new BehaviorSubject<number>(0)

  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: BirdCard }) { }

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
