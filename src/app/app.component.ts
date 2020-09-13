import { Component, OnInit } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { CookiesService } from './cookies.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wingsearch'
  displayConsent = false

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private cookies: CookiesService) {
    iconRegistry.addSvgIcon('bird', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/bird.svg'))
    iconRegistry.addSvgIcon('bowl', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/bowl.svg'))
    iconRegistry.addSvgIcon('card', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/card.svg'))
    iconRegistry.addSvgIcon('cavity', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/cavity.svg'))
    iconRegistry.addSvgIcon('die', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/die.svg'))
    iconRegistry.addSvgIcon('egg', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/egg.svg'))
    iconRegistry.addSvgIcon('fish', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/fish.svg'))
    iconRegistry.addSvgIcon('flocking', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/flocking.svg'))
    iconRegistry.addSvgIcon('forest', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/forest.svg'))
    iconRegistry.addSvgIcon('fruit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/fruit.svg'))
    iconRegistry.addSvgIcon('grassland', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/grassland.svg'))
    iconRegistry.addSvgIcon('ground', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/ground.svg'))
    iconRegistry.addSvgIcon('invertebrate', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/invertebrate.svg'))
    iconRegistry.addSvgIcon('no-food', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/no-food.svg'))
    iconRegistry.addSvgIcon('platform', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/platform.svg'))
    iconRegistry.addSvgIcon('predator', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/predator.svg'))
    iconRegistry.addSvgIcon('rodent', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/rodent.svg'))
    iconRegistry.addSvgIcon('seed', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/seed.svg'))
    iconRegistry.addSvgIcon('star', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/star.svg'))
    iconRegistry.addSvgIcon('wetland', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/wetland.svg'))
    iconRegistry.addSvgIcon('wild', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg/wild.svg'))
  }

  ngOnInit(): void {
    if (!this.cookies.getCookie('consent'))
      this.displayConsent = true
  }

  onConsentChange() {
    this.displayConsent = false
  }
}
