import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Ng5SliderModule } from 'ng5-slider'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store'
import { SearchComponent } from './search/search.component'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { appReducer } from './store/app.reducer'
import { DisplayComponent } from './display/display.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BonusCardOptionComponent } from './bonus-card-option/bonus-card-option.component'
import { BirdCardComponent } from './bird-card/bird-card.component'
import { BonusCardComponent } from './bonus-card/bonus-card.component'
import { HttpClientModule } from '@angular/common/http'
import { IconizePipe } from './iconize.pipe'
import { ServiceWorkerModule } from '@angular/service-worker'
import { StatsComponent } from './stats/stats.component'
import { CardDetailComponent } from './card-detail/card-detail.component'
import { CookiesService } from './cookies.service';
import { ConsentComponent } from './consent/consent.component'

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DisplayComponent,
    BonusCardOptionComponent,
    BirdCardComponent,
    BonusCardComponent,
    IconizePipe,
    StatsComponent,
    CardDetailComponent,
    ConsentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    Ng5SliderModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ app: appReducer, router: routerReducer }, {}),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [CookiesService],
  bootstrap: [AppComponent],
  entryComponents: [CardDetailComponent]
})
export class AppModule { }
