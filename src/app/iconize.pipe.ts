import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iconize'
})
export class IconizePipe implements PipeTransform {

  private static readonly NON_SEPARATION_SPECIAL_CHARACTERS = ['\\.', ',', ';', '\\-', '\\)']

  static nonSeparationSpecialCharactersRegex: string = IconizePipe.NON_SEPARATION_SPECIAL_CHARACTERS.join('|');

  private readonly BASE_HTML_STRING = `
  <picture class="icon-picture">
    <source type="image/webp" srcset="assets/icons/png/$1.webp">
    <source type="image/png" srcset="assets/icons/png/$1.png">
    <img class="icon-image" src="assets/icons/png/$1.png" alt="$1" aria-hidden="false" aria-label="$1 icon">
  </picture>
  `
  private readonly NOBR_HTML_STRING = `<span class="nobr">` + this.BASE_HTML_STRING + `$2` + `</span>`

  private readonly DARK_MAP = {
    'seed': 'seed-dark'
  }

  private readonly GLOW_MAP = {
    'forest': 'forest-glow',
    'grassland': 'grassland-glow',
    'wetland': 'wetland-glow',
    'seed': 'seed-glow',
    'seed-dark': 'seed-dark-glow',
    'invertebrate': 'invertebrate-glow',
    'fish': 'fish-glow',
    'fruit': 'fruit-glow',
    'rodent': 'rodent-glow',
    'nectar': 'nectar-glow',
    'wild': 'wild-glow'
  }

  transform(value: string, dark = false, glow = false): string {
    let result = value && value
      .replace(new RegExp('\\[([a-z\\-]+)\\]' + '(?!' + IconizePipe.nonSeparationSpecialCharactersRegex + ')', 'g'), this.BASE_HTML_STRING)
      .replace(new RegExp('\\[([a-z\\-]+)\\]' + '(' + IconizePipe.nonSeparationSpecialCharactersRegex + ')', 'g'), this.NOBR_HTML_STRING)

    if (dark)
      Object.entries(this.DARK_MAP).forEach(([key, value]) =>
        ['.png', '.webp'].forEach(suffix => result = result.replace(new RegExp(key + suffix, "g"), value + suffix))
      )
    
    if (glow)
      Object.entries(this.GLOW_MAP).forEach(([key, value]) =>
        ['.png', '.webp'].forEach(suffix => result = result.replace(new RegExp(key + suffix, "g"), value + suffix))
      )

    return result
  }

}
