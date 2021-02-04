import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[applinkWatcher]'
})
export class ApplinkDirective {
  
  constructor(private router: Router) {}

  @HostListener('click', ['$event.target']) onClick($event) {
    this.router.navigate([$event.getAttribute('applink')])
  }
}
