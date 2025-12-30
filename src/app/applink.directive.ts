import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[applinkWatcher]'
})
export class ApplinkDirective {
  
  constructor(private router: Router) {}

  @HostListener('click', ['$event.target']) onClick($event) {
    const url: string = $event.getAttribute('applink')
    if (!url)
      return
    if(url.match(/http:\/\/|https:\/\//))
      window.location.href = url
    else
      this.router.navigate([url])
  }
}
