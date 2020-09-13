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
    this.cookies.setCookie('consent', value, 180)
    this.consentChange.emit(value)
  }
}
