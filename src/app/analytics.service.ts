import { Injectable } from '@angular/core'
import { CookiesService } from './cookies.service'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private cookies: CookiesService) {
    // @ts-ignore
    window.dataLayer = window.dataLayer || []
  }

  setLanguage(language: string) {
    if (!this.cookies.hasConsent())
      return

    // @ts-ignore
    this.gtag('js', new Date())
    // @ts-ignore
    this.gtag('config', 'UA-177825186-1', { dimension1: language })
  }

  sendEvent(eventName: string, metaData = {}) {
    // @ts-ignore
    this.gtag('event', eventName, metaData)
  }

  private gtag() {
    // @ts-ignore
    dataLayer.push(arguments)
  }
}
