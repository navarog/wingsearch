import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { BirdCard, BonusCard, isBirdCard, isHummingbirdCard, isBonusCard, isBirdOrHummingbirdCard } from '../store/app.interfaces'
import { selectCard, State, selectCardId } from '../store/router'
import { Observable, BehaviorSubject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import * as appActions from '../store/app.actions'
import { BirdCardDetailComponent } from '../bird-card/bird-card-detail/bird-card-detail.component'
import { BonusCardDetailComponent } from '../bonus-card/bonus-card-detail/bonus-card-detail.component'
import { HummingbirdCardDetailComponent } from '../hummingbird-card/hummingbird-card-detail/hummingbird-card-detail.component'
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

  private readonly BIRD_DIALOG_ID = '0'
  private readonly BONUS_DIALOG_ID = '1'
  private readonly HUMMINGBIRD_DIALOG_ID = '2'

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef

  cardHeight$ = new BehaviorSubject<number>(0)
  selectedCardType: 'bird' | 'hummingbird' | 'bonus' | null = null

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
        this.selectedCardType = null
        return
      }

      const newCardType = isBirdCard(card) ? 'bird'
        : isHummingbirdCard(card) ? 'hummingbird'
        : 'bonus'

      if (newCardType === this.selectedCardType) {
        // Update existing dialog
        const dialogId = newCardType === 'bird' ? this.BIRD_DIALOG_ID
          : newCardType === 'hummingbird' ? this.HUMMINGBIRD_DIALOG_ID
          : this.BONUS_DIALOG_ID
        const dialogRef = this.dialog.getDialogById(dialogId).componentInstance
        dialogRef.data = { card: card }
        dialogRef.initBonuses()
      } else {
        // Open new dialog
        this.dialog.closeAll()
        this.selectedCardType = newCardType
        if (newCardType === 'bird') {
          this.openBirdDialog(card as BirdCard)
        } else if (newCardType === 'hummingbird') {
          this.openHummingbirdDialog(card as BirdCard)
        } else {
          this.openBonusDialog(card as BonusCard)
        }
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

  isHummingbirdCard(card: BirdCard | BonusCard): card is BirdCard {
    return isHummingbirdCard(card)
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
      closeOnNavigation: false,
      height: '100vh',
      width: '80vw',
      maxWidth: '80vw',
      id: this.BIRD_DIALOG_ID,
      autoFocus: false,
    }).afterClosed().subscribe(() => {
      if (!this.dialog.getDialogById(this.HUMMINGBIRD_DIALOG_ID)
          && !this.dialog.getDialogById(this.BONUS_DIALOG_ID))
        this.router.navigate(['/'])
    })
  }

  openBonusDialog(card: BonusCard) {
    this.dialog.open(BonusCardDetailComponent, {
      data: { card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: false,
      height: '100vh',
      width: '80vw',
      maxWidth: '80vw',
      id: this.BONUS_DIALOG_ID,
      autoFocus: false,
    }).afterClosed().subscribe(() => {
      if (!this.dialog.getDialogById(this.BIRD_DIALOG_ID)
          && !this.dialog.getDialogById(this.HUMMINGBIRD_DIALOG_ID))
        this.router.navigate(['/'])
    })
  }

  openHummingbirdDialog(card: BirdCard) {
    this.dialog.open(HummingbirdCardDetailComponent, {
      data: { card },
      panelClass: 'card-detail-panel',
      closeOnNavigation: false,
      height: '100vh',
      width: '80vw',
      maxWidth: '80vw',
      id: this.HUMMINGBIRD_DIALOG_ID,
      autoFocus: false,
    }).afterClosed().subscribe(() => {
      if (!this.dialog.getDialogById(this.BIRD_DIALOG_ID)
          && !this.dialog.getDialogById(this.BONUS_DIALOG_ID))
        this.router.navigate(['/'])
    })
  }

  onScroll() {
    this.store.dispatch(appActions.scroll())
    this.analytics.sendEvent('Scroll cards', { event_category: 'engagement' })
  }

  onCardClick(card: BirdCard | BonusCard) {
    // Add bird cards to playlist and immediately start playing them
    if (isBirdOrHummingbirdCard(card)) {
      this.store.dispatch(appActions.addToPlaylistAndPlay({ birdId: card.id }))
    }
  }
}
