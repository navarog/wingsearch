import * as fromRouter from '@ngrx/router-store'
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { AppState } from './app.interfaces'

export interface State {
    router: fromRouter.RouterReducerState<any>
    app: AppState
}

export const selectRouter = createFeatureSelector<
    State,
    fromRouter.RouterReducerState<any>
>('router')

export const {
    selectCurrentRoute,   // select the current route
    selectFragment,       // select the current route fragment
    selectQueryParams,    // select the current route query params
    selectQueryParam,     // factory function to select a query param
    selectRouteParams,    // select the current route params
    selectRouteParam,     // factory function to select a route param
    selectRouteData,      // select the current route data
    selectUrl,            // select the current url
} = fromRouter.getSelectors(selectRouter)

export const selectCardId = selectRouteParam('id')

export const selectCard = createSelector(
    (state: State) => [...state.app.birdCards, ...state.app.bonusCards],
    selectCardId,
    (cards, id) => cards.find(card => card.id.toString() === id)
)
