import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppState, BirdCard, BonusCard } from 'src/app/store/app.interfaces'
import { bonusSearchMap } from 'src/app/store/bonus-search-map'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-bird-card-detail',
  templateUrl: './bird-card-detail.component.html',
  styleUrls: ['./bird-card-detail.component.scss']
})
export class BirdCardDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cardElement', { read: ElementRef })
  cardElement: ElementRef
  @ViewChild('cardWrapper', { read: ElementRef })
  cardWrapper: ElementRef
  @ViewChild('carousel', { read: ElementRef })
  carousel: ElementRef

  layout: 'desktop' | 'mobile'
  cardHeight$ = new BehaviorSubject<number>(0)
  bonusCardHeight$ = new BehaviorSubject<number>(0)
  bonusCards$: Observable<BonusCard[]>
  private audioElement: HTMLAudioElement | null = null

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: BirdCard },
    private store: Store<{ app: AppState }>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.layout = this.calculateLayout(window.innerWidth)
    this.initBonuses()
    this.playRandomRecording()
  }

  initBonuses() {
    this.bonusCards$ = this.store.pipe(
      select(({ app }) => app.bonusCards),
      map(cards => {
        const filteredCards = cards.filter(card => card['VP Average'] && bonusSearchMap[card.id].callbackfn(this.data.card))
        filteredCards.sort((a, b) => b['VP Average'] - a['VP Average'])
        return filteredCards
      })
    )
    this.cardWrapper?.nativeElement.scroll(0, 0)
    this.carousel?.nativeElement.scroll(0, 0)
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
    setTimeout(() => this.bonusCardHeight$.next(this.calcBonusCardHeight()), 0)
  }

  calcBonusCardHeight(): number {
    return (this.layout === 'desktop') ? window.innerWidth / 5 * 1.50 : this.cardHeight$.value
  }

  onResize(event) {
    this.layout = this.calculateLayout(event.target.innerWidth)
    setTimeout(() => this.cardHeight$.next(this.cardElement.nativeElement.offsetHeight), 0)
    setTimeout(() => this.bonusCardHeight$.next(this.calcBonusCardHeight()), 0)
  }

  calculateLayout(width): 'desktop' | 'mobile' {
    if (width < 600)
      return 'mobile'
    else
      return 'desktop'
  }

  bonusCardStyle(i: number) {
    return this.bonusCardHeight$.pipe(
      map(height => {
        const styles = { 'height.px': height, 'z-index': i }
        if (this.layout === 'desktop')
          return { 'border-radius.px': height * 0.025, ...styles }
        else
          return { 'border-top-left-radius.px': height * 0.025, 'border-top-right-radius.px': height * 0.025, ...styles }
      })
    )
  }

  cardStatsStyle() {
    return this.bonusCardHeight$.pipe(
      map(height => {
        if (this.layout === 'desktop')
          return {}
        else
          return { 'border-bottom-left-radius.px': height * 0.025, 'border-bottom-right-radius.px': height * 0.025 }
      })
    )
  }

  private playRandomRecording(): void {
    // Stop any currently playing audio
    this.stopAudio()

    // Check if the bird has recordings
    if (!this.data.card.recordings || this.data.card.recordings.length === 0) {
      return
    }

    // Select a random recording
    const randomIndex = Math.floor(Math.random() * this.data.card.recordings.length)
    const selectedRecording = this.data.card.recordings[randomIndex]

    // Create and play the audio
    this.audioElement = new Audio(selectedRecording)
    this.audioElement.volume = 0 // Start at 0 volume for fade-in

    // Handle audio load and play
    this.audioElement.addEventListener('canplay', () => {
      this.audioElement?.play().then(() => {
        // Start volume fade-in after playback begins
        this.fadeInVolume()
      }).catch(error => {
        console.warn('Audio playback failed:', error)
        // Audio playback might fail due to browser autoplay policies
        // This is expected and not a critical error
      })
    })

    // Handle errors
    this.audioElement.addEventListener('error', (error) => {
      console.warn('Audio loading failed:', error)
      // CORS or network issues - this is expected for some URLs
    })

    // Load the audio
    this.audioElement.load()
  }

  private fadeInVolume(): void {
    if (!this.audioElement) return

    const targetVolume = 0.7 // Target volume (70%)
    const fadeSteps = 50 // Number of volume steps
    const fadeInterval = 30 // Milliseconds between steps (1.5 second total fade)
    const volumeStep = targetVolume / fadeSteps

    let currentStep = 0
    const fadeTimer = setInterval(() => {
      if (!this.audioElement || currentStep >= fadeSteps) {
        clearInterval(fadeTimer)
        return
      }

      currentStep++
      this.audioElement.volume = Math.min(volumeStep * currentStep, targetVolume)

      if (currentStep >= fadeSteps) {
        clearInterval(fadeTimer)
      }
    }, fadeInterval)
  }

  private stopAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
      this.audioElement = null
    }
  }

  ngOnDestroy(): void {
    this.stopAudio()
  }
}
