import { Pipe, PipeTransform } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from './store/app.interfaces'

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  translatedContent: {
    [key: string]: string
  }

  transform(value: string): string {
    return this.translatedContent[value] || value
  }

  constructor(private store: Store<{ app: AppState }>) {
    store.select(({ app }) => app.translatedContent)
      .subscribe(translatedContent => {
        this.translatedContent = Object.entries(translatedContent).reduce((acc, val) =>
          ({ ...acc, [val[0].replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g, ' ')]: val[1].Translated }),
          {})
      })
  }
}
