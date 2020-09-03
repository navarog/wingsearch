import { createReducer, on } from '@ngrx/store'
import * as appActions from './app.actions'
import { AppState, isBirdCard } from './app.interfaces'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'
import { birdCardsSearch, bonusCardsSearch } from './cards-search'
import { bonusSearchMap } from './bonus-search-map'


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
    displayedCards: BirdCards.concat(BonusCards),
    // @ts-ignore
    activeBonusCards: BonusCards,
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

        if (!displayedCards.length && !action.main) {
            // @ts-ignore
            displayedCards = BirdCards.concat(BonusCards)
        }

        if (action.bonus) {
            const bonusCards = state.search.bonusCards.search({
                query: action.bonus, field: 'Name'
            })

            if (bonusCards.length === 1) {
                displayedCards = displayedCards.filter(isBirdCard).filter(bonusSearchMap[bonusCards[0].id])
            }
        } else {
            const bonusCards = state.search.bonusCards.search({
                query: action.main, field: [
                    'Name',
                    'Condition',
                    'VP',
                ]
            })

            displayedCards = displayedCards.concat(bonusCards)
        }

        return { ...state, displayedCards }
    }),

    on(appActions.bonusCardSearch, (state, action) => {
        let activeBonusCards = state.search.bonusCards.search({
            query: action.bonus, field: [
                'Name',
                'Condition',
                'VP',
            ]
        })

        if (!activeBonusCards.length && !action.bonus) {
            // @ts-ignore
            activeBonusCards = BonusCards
        }

        return { ...state, activeBonusCards }
    })
)

export function appReducer(state, action) {
    return reducer(state, action)
}
