import { Component, OnInit } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser';
import { CookiesService } from './cookies.service'
import { PlaylistAudioService } from './playlist-audio.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wingsearch'
  displayConsent = false

  constructor(
    private cookies: CookiesService,
    registry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private playlistAudioService: PlaylistAudioService
  ) {
    registry.addSvgIcon('externalLink', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/external-link.svg'))
  }

  ngOnInit(): void {
    this.displayConsent = !Number(this.cookies.getCookie('consent'))
  }

  onConsentChange() {
    this.displayConsent = false
  }
}
