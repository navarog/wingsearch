import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iconize'
})
export class IconizePipe implements PipeTransform {

  private readonly BASE_HTML_STRING = '<img class="icon-image" src="assets/icons/png/$1.png" aria-hidden="false" aria-label="$1 icon">'

  transform(value: string, ...args: unknown[]): string {
    return value.replace(/\[([a-z]+)\]/g, this.BASE_HTML_STRING)
  }

}
