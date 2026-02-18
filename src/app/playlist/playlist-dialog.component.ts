import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AppState } from '../store/app.interfaces'
import * as appActions from '../store/app.actions'

@Component({
  selector: 'app-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.scss']
})
export class PlaylistDialogComponent implements OnInit {
  playlistCount$: Observable<number>
  isPlaying$: Observable<boolean>
  isShuffled$: Observable<boolean>
  volume$: Observable<number>

  constructor(
    private dialogRef: MatDialogRef<PlaylistDialogComponent>,
    private store: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.playlistCount$ = this.store.select(({ app }) => app.playlist.birdIds.length)
    this.isPlaying$ = this.store.select(({ app }) => app.playlist.isPlaying)
    this.isShuffled$ = this.store.select(({ app }) => app.playlist.isShuffled)
    this.volume$ = this.store.select(({ app }) => app.playlist.volume)
  }

  togglePlayback(): void {
    this.store.select(({ app }) => app.playlist).subscribe(playlist => {
      if (playlist.birdIds.length === 0) return

      if (playlist.isPlaying) {
        this.store.dispatch(appActions.pausePlaylist())
      } else {
        this.store.dispatch(appActions.startPlaylist())
      }
    }).unsubscribe()
  }

  nextSong(): void {
    this.store.dispatch(appActions.nextSong())
  }

  toggleShuffle(): void {
    this.store.dispatch(appActions.toggleShuffle())
  }

  clearPlaylist(): void {
    this.store.dispatch(appActions.clearPlaylist())
  }

  onVolumeChange(volume: number): void {
    this.store.dispatch(appActions.setPlaylistVolume({ volume }))
  }

  close(): void {
    this.dialogRef.close()
  }
}