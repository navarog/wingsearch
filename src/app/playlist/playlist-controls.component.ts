import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AppState, BirdCard, isBirdOrHummingbirdCard } from '../store/app.interfaces'
import { PlaylistDialogComponent } from './playlist-dialog.component'
import * as appActions from '../store/app.actions'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-playlist-controls',
  templateUrl: './playlist-controls.component.html',
  styleUrls: ['./playlist-controls.component.scss']
})
export class PlaylistControlsComponent implements OnInit {
  playlistCount$: Observable<number>
  isPlaying$: Observable<boolean>
  currentBirdName$: Observable<string>

  constructor(
    private store: Store<{ app: AppState }>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.playlistCount$ = this.store.select(({ app }) => app.playlist ? app.playlist.birdIds.length : 0)
    this.isPlaying$ = this.store.select(({ app }) => app.playlist ? app.playlist.isPlaying : false)
  }

  openPlaylistDialog(): void {
    this.dialog.open(PlaylistDialogComponent, {
      maxWidth: 'min(700px, 80vw)',
      width: '90vw',
      maxHeight: '80vh'
    })
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
}