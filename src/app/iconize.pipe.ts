import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iconize'
})
export class IconizePipe implements PipeTransform {

  private readonly BASE_HTML_STRING = `
  <picture>
    <source type="image/webp" srcset="assets/icons/png/$1.webp">
    <source type="image/png" srcset="assets/icons/png/$1.png">
    <img class="icon-image" src="assets/icons/png/$1.png" aria-hidden="false" aria-label="$1 icon">
  </picture>
  `

  transform(value: string, ...args: unknown[]): string {
    return value && value.replace(/\[([a-z]+)\]/g, this.BASE_HTML_STRING)
  }

}
