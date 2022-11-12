import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { from, of } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { CookiesService } from '../cookies.service'
import { changeLanguage } from './app.actions'

@Injectable()
export class AppEffects {
    readonly I18N_FOLDER = 'assets/data/i18n/'

    loadLanguage$ = createEffect(() => this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT, changeLanguage),
        mergeMap((action) => {
            const language = action.language || (this.cookies.hasConsent() && this.cookies.getCookie('language'))
            if (language)
            {
              const expansion = action.expansion || {
                  asia: this.cookies.getCookie('expansion.asia') !== '0',
                  oceania: this.cookies.getCookie('expansion.oceania') !== '0',
                  european: this.cookies.getCookie('expansion.european') !== '0',
                  swiftstart: this.cookies.getCookie('expansion.swiftstart') !== '0',
                  originalcore: this.cookies.getCookie('expansion.core') !== '0',
              }
              return from(this.http.get(this.I18N_FOLDER + language + '.json')).pipe(
                map((data) => ({ type: '[App] Set language', payload: data, language: language, expansion: expansion }))
              )
            }
            else
                return of({ type: '[App] English' })
        })
    ))

    constructor(
        private actions$: Actions,
        private cookies: CookiesService,
        private http: HttpClient
    ) { }
}
