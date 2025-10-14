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
                  core: this.cookies.getCookie('expansion.core') !== '0'
              }
              const promoPack = action.promoPack || {
                  fanAsia: this.cookies.getCookie('expansion.fanAsia') !== '0',
                  fanCA: this.cookies.getCookie('expansion.fanCA') !== '0',
                  fanEurope: this.cookies.getCookie('expansion.fanEurope') !== '0',
                  fanNZ: this.cookies.getCookie('expansion.fanNZ') !== '0',
                  fanUK: this.cookies.getCookie('expansion.fanUK') !== '0',
                  fanUS: this.cookies.getCookie('expansion.fanUS') !== '0'
              }
              return from(this.http.get(this.I18N_FOLDER + language + '.json')).pipe(
                map((data) => ({ type: '[App] Set language', payload: data, language: language, expansion: expansion, promoPack: promoPack }))
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
