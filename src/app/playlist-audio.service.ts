import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { BehaviorSubject, Subscription } from 'rxjs'
import { AppState, BirdCard, isBirdOrHummingbirdCard } from './store/app.interfaces'
import * as appActions from './store/app.actions'

@Injectable({
  providedIn: 'root'
})
export class PlaylistAudioService implements OnDestroy {
  private audioElement: HTMLAudioElement | null = null
  private storeSubscription: Subscription
  private fadeTimer: any
  private currentBirdCard: BirdCard | null = null

  constructor(private store: Store<{ app: AppState }>) {
    this.initializeService()
  }

  private initializeService(): void {
    // Subscribe to playlist state changes only
    this.storeSubscription = this.store.select(({ app }) => app.playlist).subscribe(playlist => {
      // Get full app state when playlist changes
      this.store.select(({ app }) => app).subscribe(fullState => {
        this.handleStateChange(fullState)
      }).unsubscribe()
    })
  }

  private handleStateChange(state: AppState): void {
    const playlist = state.playlist

    // Handle play/pause state changes
    if (playlist.isPlaying) {
      if (!this.audioElement || playlist.currentBirdId !== this.currentBirdCard?.id) {
        // Start playing new song or resume from stopped state
        this.playCurrentSong(state)
      } else if (this.audioElement.paused) {
        // Resume paused audio
        this.resumeAudio()
      }
    } else if (!playlist.isPlaying) {
      // Stop playback
      this.stopAudio()
    }

    // Handle volume changes
    if (this.audioElement && this.audioElement.volume !== playlist.volume) {
      this.audioElement.volume = playlist.volume
    }
  }

  private playCurrentSong(state: AppState): void {
    const playlist = state.playlist

    if (playlist.birdIds.length === 0 || playlist.currentBirdId === null) {
      this.store.dispatch(appActions.stopPlaylist())
      return
    }

    // Find the current bird card - only look in actual bird cards since bonuses don't have recordings
    const currentBirdCard = state.birdCards
      .find(card => card.id === playlist.currentBirdId)

    if (!currentBirdCard || !currentBirdCard.recordings || currentBirdCard.recordings.length === 0) {
      // Skip to next song if current bird has no recordings
      this.store.dispatch(appActions.nextSong())
      return
    }

    this.currentBirdCard = currentBirdCard

    // Stop any currently playing audio
    this.stopAudio()

    // Select a random recording from the current bird
    const randomIndex = Math.floor(Math.random() * currentBirdCard.recordings.length)
    const selectedRecording = currentBirdCard.recordings[randomIndex]

    // Create new audio element
    this.audioElement = new Audio(selectedRecording)
    this.audioElement.volume = 0 // Start at 0 volume for fade-in

    // Handle audio events
    this.audioElement.addEventListener('canplay', () => {
      if (this.audioElement) {
        this.audioElement.play().then(() => {
          // Start volume fade-in after playback begins
          this.fadeInVolume(playlist.volume)
        }).catch(error => {
          console.warn('Playlist audio playback failed:', error)
          // Skip to next song on playback failure
          this.store.dispatch(appActions.nextSong())
        })
      }
    })

    this.audioElement.addEventListener('error', (error) => {
      console.warn('Playlist audio loading failed:', error)
      // Skip to next song on loading failure
      this.store.dispatch(appActions.nextSong())
    })

    this.audioElement.addEventListener('ended', () => {
      // Song finished, advance to next
      this.store.dispatch(appActions.playlistSongEnded())
    })

    // Load the audio
    this.audioElement.load()
  }

  private fadeInVolume(targetVolume: number): void {
    if (!this.audioElement) return

    const fadeSteps = 50 // Number of volume steps
    const fadeInterval = 30 // Milliseconds between steps (1.5 second total fade)
    const volumeStep = targetVolume / fadeSteps

    let currentStep = 0
    this.fadeTimer = setInterval(() => {
      if (!this.audioElement || currentStep >= fadeSteps) {
        clearInterval(this.fadeTimer)
        this.fadeTimer = null
        return
      }

      currentStep++
      this.audioElement.volume = Math.min(volumeStep * currentStep, targetVolume)

      if (currentStep >= fadeSteps) {
        clearInterval(this.fadeTimer)
        this.fadeTimer = null
      }
    }, fadeInterval)
  }

  private pauseAudio(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause()
    }
  }

  private resumeAudio(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().catch(error => {
        console.warn('Playlist audio resume failed:', error)
        // Skip to next song on resume failure
        this.store.dispatch(appActions.nextSong())
      })
    }
  }

  private stopAudio(): void {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer)
      this.fadeTimer = null
    }

    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
      this.audioElement = null
    }

    this.currentBirdCard = null
  }


  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe()
    }
    this.stopAudio()
  }
}