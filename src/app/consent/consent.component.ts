import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CookiesService } from '../cookies.service'

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent implements OnInit {
  @Output()
  consentChange = new EventEmitter<string>()

  constructor(private cookies: CookiesService) { }

  ngOnInit(): void {
  }

  setConsent(value: string) {
    this.cookies.setCookie('consent', value, 180, true)
    this.consentChange.emit(value)

    if (value === '1') {
      // @ts-ignore
      window.dataLayer = window.dataLayer || []
      // @ts-ignore
      function gtag() { dataLayer.push(arguments) }
      // @ts-ignore
      gtag('js', new Date())
      // @ts-ignore
      gtag('config', 'UA-177825186-1', { dimension1: this.cookies.getCookie('language') || 'en' })
    }
  }
}
