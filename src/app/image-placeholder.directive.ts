import { Directive, ElementRef, Renderer2, Input, AfterViewInit } from '@angular/core'

@Directive({
  selector: '[appImagePlaceholder]',
})
export class ImagePlaceholderDirective implements AfterViewInit {

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) { }

  @Input() src: string

  @Input() placeholder: string

  private _SUPPORTED_IMAGES_FORMAT: string[] = ['jpg', 'png', 'ico', 'svg', 'jpeg']

  public currentElement: any

  private _TRANSITION_DELAY_TIME = '0.5s'

  private _REMOTE_MARKERS: any[] = ['http', 'msecnd.net', 'yum-resources']

   ngAfterViewInit() {
    this.currentElement = this.elem.nativeElement
    this.transform(this.src)
  }

   transform(asset: string) {
    const finalImageUrl = asset
    const fallbackImage = this.placeholder ? this.placeholder : ''
    if (!asset || asset === '') {
      return this.loadImage(fallbackImage)
    }
    if (!this._isImageAsset(asset)) {
      return this.loadImage(fallbackImage)
    }
    return this.loadImage(asset)
  }

  loadImage(image: string) {
    const defaultImage = this.placeholder ? this.placeholder : ''
    this.currentElement.src = defaultImage
    const img = new Image()
    if (image) {
      img.src = image
    } else {
      img.src = defaultImage
    }
    img.onload = () => {
      this.currentElement.src = img.src
      this._styleUpdateAfterLoad()
    }
    img.onerror = err => {
      this.currentElement.src = defaultImage
      this._styleUpdateAfterLoad()
    }
  }

  private _styleUpdateAfterLoad() {
    this.renderer.setStyle(
      this.currentElement,
      'opacity', 1
    )
    this.renderer.setStyle(
      this.currentElement,
      'transition-delay',
      this._TRANSITION_DELAY_TIME
    )
  }

  private _isImageAsset(name: string) {
    if (!name || name === null || name === '') { return false }
    for (const supportedFormat of this._SUPPORTED_IMAGES_FORMAT) {
      const formatLength = supportedFormat.length
      if (name.length > formatLength) {
        const format = name.slice(-formatLength).toLowerCase()
        if (supportedFormat === format) {
          return true
        }
      }
    }
    return false
  }

}
