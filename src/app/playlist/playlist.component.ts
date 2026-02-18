import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppState, BirdCard, isBirdOrHummingbirdCard, BeakDirection, LeftBeakDirections } from '../store/app.interfaces'
import * as appActions from '../store/app.actions'

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlistBirds$: Observable<BirdCard[]>
  currentBirdId$: Observable<number | null>

  constructor(private store: Store<{ app: AppState }>) { }

  ngOnInit(): void {
    this.playlistBirds$ = this.store.select(({ app }) => app).pipe(
      map(state => {
        const allBirds = state.birdCards

        return state.playlist.birdIds
          .map(id => allBirds.find(bird => bird.id === id))
          .filter(bird => bird !== undefined) as BirdCard[]
      })
    )

    this.currentBirdId$ = this.store.select(({ app }) => app.playlist.currentBirdId)
  }

  removeFromPlaylist(birdId: number): void {
    this.store.dispatch(appActions.removeFromPlaylist({ birdId }))
  }

  playBird(birdId: number): void {
    // Use the existing addToPlaylistAndPlay action which will jump to this bird and play it
    this.store.dispatch(appActions.addToPlaylistAndPlay({ birdId }))
  }

  isCurrentlyPlaying(birdId: number, currentBirdId: number | null): boolean {
    return birdId === currentBirdId
  }

  getBeakDirection(bird: BirdCard): string {
    const beakDirection = bird['Beak direction'] as BeakDirection
    return LeftBeakDirections.includes(beakDirection) ? 'left' : 'right'
  }
}