import {
    Directive,
    ElementRef,
    Input,
    AfterViewInit,
    NgZone,
    OnChanges,
    SimpleChanges
  } from '@angular/core';
  
  @Directive({
    selector: '[fitText]'
  })
  export class FitTextDirective implements AfterViewInit, OnChanges {
  
    @Input() minFontSize = 8;
    @Input() maxFontSize = 24;
    @Input() fitText = ''; // text input trigger
  
    private el: HTMLElement;
  
    constructor(
      private elementRef: ElementRef,
      private ngZone: NgZone
    ) {
      this.el = this.elementRef.nativeElement;
    }
  
    ngAfterViewInit() {
      this.scheduleFit();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes.fitText) {
        this.scheduleFit();
      }
    }
  
    private scheduleFit() {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => this.fit());
      });
    }
  
    private fit() {
        this.el.style.fontSize = this.maxFontSize + 'px';
        this.el.style.lineHeight = (this.maxFontSize + 1) + 'px';
      
        if (this.fits()) {
          return;
        }
      
        let low = this.minFontSize;
        let high = this.maxFontSize - 1;
        let best = low;
      
        while (low <= high) {
          const mid = (low + high) >> 1;
          this.el.style.fontSize = mid + 'px';
          this.el.style.lineHeight = (mid + 1) + 'px';
      
          if (this.fits()) {
            best = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
      
        this.el.style.fontSize = best + 'px';
        this.el.style.lineHeight = (best + 1) + 'px';
    }
  
    private fits(): boolean {
      return (
        this.el.scrollHeight <= this.el.clientHeight &&
        this.el.scrollWidth <= this.el.clientWidth
      );
    }
  }