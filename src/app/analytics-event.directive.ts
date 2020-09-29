import { Directive, HostListener, Input } from '@angular/core'
import { AnalyticsService } from './analytics.service'

@Directive({
  selector: '[appAnalyticsEvent]'
})
export class AnalyticsEventDirective {

  @Input('appAnalyticsEvent') eventName: string
  @Input() eventCategory = 'engagement'
  @Input() eventLabel = ''
  @Input() eventListening = 'click'

  @HostListener('click') onEvent() {
    this.analytics.sendEvent(this.eventName, { event_category: this.eventCategory, event_label: this.eventLabel })
  }

  constructor(private analytics: AnalyticsService) { }

}
