import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

import * as Modernizr from 'modernizr'

if (environment.production) {
  enableProdMode()
}

// tslint:disable-next-line: no-unused-expression
Modernizr.webpalpha

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
