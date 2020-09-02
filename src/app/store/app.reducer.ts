import { createReducer, on } from '@ngrx/store'
import * as appActions from './app.actions'
import { AppState, isBirdCard } from './app.interfaces'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'
import { birdCardsSearch, bonusCardsSearch } from './cards-search'


export const initialState: AppState = {
    // @ts-ignore
    birdCards: BirdCards,
    // @ts-ignore
    bonusCards: BonusCards,
    search: {
        birdCards: birdCardsSearch,
        bonusCards: bonusCardsSearch,
    },
    // @ts-ignore
    displayedCards: BirdCards.concat(BonusCards)
}

const reducer = createReducer(
    initialState,
    on(appActions.search, (state, action) => {
        let displayedCards = state.search.birdCards.search({
            query: action.main, field: [
                'Common name',
                'Scientific name',
                'Power text',
            ]
        })

        if (!displayedCards.length) {
            // @ts-ignore
            displayedCards = BirdCards.concat(BonusCards)
        }

        return { ...state, displayedCards }
    })
)

export function appReducer(state, action) {
    return reducer(state, action)
}
