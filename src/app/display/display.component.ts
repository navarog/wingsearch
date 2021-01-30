import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { BirdCard, BonusCard, isBirdCard, isBonusCard } from '../store/app.interfaces'
import { selectCard, State } from '../store/router'
import { Observable, BehaviorSubject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { scroll } from '../store/app.actions'
import { BirdCardDetailComponent } from '../bird-card/bird-card-detail/bird-card-detail.component'
import { BonusCardDetailComponent } from '../bonus-card/bonus-card-detail/bonus-card-detail.component'
import { AnalyticsService } from '../analytics.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, AfterViewInit {

  cards$: Observable<(BirdCard | BonusCard)[]>
  selectedCard$: Observable<BirdCard | BonusCard>
  scrollDisabled$: Observable<boolean>

  private readonly CARD_MINIMUM_WIDTH = 165

  private readonly MAX_DISPLAY_COLUMNS = 6

  private readonly DIALOG_ID = '0'

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  cardHeight$ = new BehaviorSubject<number>(0)
  isSelectedCardBird: boolean;

  constructor(private store: Store<State>, public dialog: MatDialog, private analytics: AnalyticsService, private router: Router, private route: ActivatedRoute) {
    this.cards$ = this.store.select(({ app }) => app.displayedCards)
    this.scrollDisabled$ = this.store.select(({ app }) => app.scrollDisabled)
    this.selectedCard$ = this.store.select(selectCard)
  }

  columns: number

  ngOnInit(): void {
    this.columns = this.calculateColumns(window.innerWidth)
    this.selectedCard$.subscribe(card => {
      if (!card) {
        this.dialog.closeAll()
        this.isSelectedCardBird = null;
        return
      }

      if ((isBirdCard(card) && this.isSelectedCardBird) || (isBonusCard(card) && this.isSelectedCardBird === false)) {
        const dialogRef = this.dialog.getDialogById(this.DIALOG_ID).componentInstance
        dialogRef.data = { card: card }
        dialogRef.initBonuses()
      } else {
        this.dialog.closeAll()
        this.isSelectedCardBird = isBirdCard(card)
        isBirdCard(card) ? this.openBirdDialog(card) : this.openBonusDialog(card)
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
  }

  private calculateColumns(width): number {
    return Math.min(Math.floor(width / this.CARD_MINIMUM_WIDTH), this.MAX_DISPLAY_COLUMNS)
  }

  isBirdCard(card: BirdCard | BonusCard): card is BirdCard {
    return isBirdCard(card)
  }

  isBonusCard(card: BirdCard | BonusCard): card is BonusCard {
    return isBonusCard(card)
  }

  onResize(event) {
    this.columns = this.calculateColumns(event.target.innerWidth)
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight))
  }

  openBirdDialog(card: BirdCard) {
    this.dialog.open(BirdCardDetailComponent, {
      data: { card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: true,
      height: '100vh',
      width: '80vw',
      maxWidth: '80vw',
      id: this.DIALOG_ID,
    }).afterClosed().subscribe(() => this.router.navigate(['/']))
  }

  openBonusDialog(card: BonusCard) {
    this.dialog.open(BonusCardDetailComponent, {
      data: { card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: true,
      height: '100vh',
      width: '80vw',
      maxWidth: '80vw',
      id: this.DIALOG_ID,
    }).afterClosed().subscribe(() => this.router.navigate(['/']))
  }

  onScroll() {
    this.store.dispatch(scroll())
    this.analytics.sendEvent('Scroll cards', { event_category: 'engagement' })
  }
}
