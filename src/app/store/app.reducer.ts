import { createReducer, on } from '@ngrx/store'
import * as appActions from './app.actions'
import { AppState, isBirdCard, BirdCard, BonusCard, DisplayedStats, isBonusCard } from './app.interfaces'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'
import { birdCardsSearch, bonusCardsSearch } from './cards-search'
import { bonusSearchMap } from './bonus-search-map'


const ALLWAYS_ALLOWED_EXPANSIONS = ['originalcore', 'core', 'swiftstart']
const SLICE_WINDOW = 18

const calculateDisplayedStats = (cards: (BirdCard | BonusCard)[]): DisplayedStats => {

    const birdCards = cards.filter(isBirdCard).length
    const bonusCards = cards.filter(isBonusCard).length

    const habitat = cards.filter(isBirdCard).reduce((acc, val: BirdCard) => {
        acc.forest += val.Forest ? 1 : 0
        acc.grassland += val.Grassland ? 1 : 0
        acc.wetland += val.Wetland ? 1 : 0
        return acc
    }, { forest: 0, grassland: 0, wetland: 0 })

    return { birdCards, bonusCards, habitat }
}

const eatsForbiddenFood = (card: BirdCard, forbiddenFood: string[]): boolean => {
    const foodKeys = ['Invertebrate', 'Seed', 'Fruit', 'Fish', 'Rodent', 'Wild (food)']
    const birdFood = foodKeys.filter(key => card[key]).map(key => key.toLowerCase())
    return (!birdFood.length && forbiddenFood.includes('no-food')) || !!birdFood.find(food => forbiddenFood.includes(food))
}

export const initialState: AppState = {
    // @ts-ignore
    birdCards: BirdCards,
    // @ts-ignore
    bonusCards: BonusCards,
    search: {
        // @ts-ignore
        birdCards: birdCardsSearch(BirdCards),
        // @ts-ignore
        bonusCards: bonusCardsSearch(BonusCards),
    },
    // @ts-ignore
    displayedCards: BirdCards.concat(BonusCards).slice(0, SLICE_WINDOW),
    // @ts-ignore
    displayedCardsHidden: BirdCards.concat(BonusCards).slice(SLICE_WINDOW),
    // @ts-ignore
    activeBonusCards: BonusCards,
    // @ts-ignore
    displayedStats: calculateDisplayedStats(BirdCards.concat(BonusCards)),
    scrollDisabled: false,
    translatedContent: {}
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
            displayedCards = state.birdCards.concat(state.bonusCards)
        }

        if (action.bonus.length) {
            const bonusCards = state.bonusCards.filter(card => action.bonus.includes(card.Name))

            displayedCards = displayedCards.filter(isBirdCard).filter(card =>
                bonusCards.reduce((acc, val) => acc && bonusSearchMap[val.id](card), true)
            )
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

        const allowedExpansions = Object.entries(action.expansion).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, ALLWAYS_ALLOWED_EXPANSIONS
        )

        const allowedColors = Object.entries(action.colors).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        const forbiddenFood = Object.entries(action.food).reduce(
            (acc, val) => val[1] ? acc : [...acc, val[0]], []
        )

        const allowedNests = Object.entries(action.nest).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        displayedCards = displayedCards.filter(card =>
            allowedExpansions.includes(card.Expansion) && (isBonusCard(card) || (
                allowedColors.includes(card.Color ? card.Color.toLowerCase() : 'white')) &&
                !eatsForbiddenFood(card, forbiddenFood) &&
                allowedNests.includes(card['Nest type'])
            )
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.eggs.min <= card['Egg capacity'] && action.eggs.max >= card['Egg capacity'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.points.min <= card['Victory points'] && action.points.max >= card['Victory points'])
        )

        const displayedStats = calculateDisplayedStats(displayedCards)

        displayedCards = displayedCards.filter(card =>
            (isBonusCard(card) && action.stats.bonuses)
            || (isBirdCard(card) && (
                (action.stats.habitat.forest && card.Forest)
                || (action.stats.habitat.grassland && card.Grassland)
                || (action.stats.habitat.wetland && card.Wetland)
            ))
        )

        const displayedCardsHidden = displayedCards.slice(SLICE_WINDOW)
        displayedCards = displayedCards.slice(0, SLICE_WINDOW)

        return { ...state, displayedCards, displayedCardsHidden, displayedStats, scrollDisabled: false }
    }),

    on(appActions.bonusCardSearch, (state, action) => {
        let activeBonusCards = state.search.bonusCards.search({
            query: action.bonusfield, field: [
                'Name',
                'Condition',
                'VP',
            ]
        })

        if (!activeBonusCards.length && !action.bonusfield) {
            // @ts-ignore
            activeBonusCards = state.bonusCards
        }

        activeBonusCards = activeBonusCards.filter(card => !action.bonus.includes(card.Name))

        return { ...state, activeBonusCards }
    }),

    on(appActions.scroll, (state, action) => {
        const displayedCards = state.displayedCards.concat(state.displayedCardsHidden.slice(0, SLICE_WINDOW))
        const displayedCardsHidden = state.displayedCardsHidden.slice(SLICE_WINDOW)

        return { ...state, displayedCards, displayedCardsHidden, scrollDisabled: !displayedCardsHidden.length }
    }),

    on(appActions.setLanguage, (state, action) => {
        // @ts-ignore
        const birdCards: BirdCard[] = BirdCards.map(card => {
            const translatedKeys = ['Common name', 'Power text', 'Note']
            const translated = action.payload.birds[card.id]
            const mergeContent = translatedKeys.reduce(
                (acc, key) => (translated[key].trim() ? { ...acc, [key]: translated[key].trim() } : acc), {})
            return { ...card, ...mergeContent }
        })

        // @ts-ignore
        const bonusCards: BonusCard[] = BonusCards.map(card => {
            const translatedKeys = ['Name', 'Condition', 'Explanatory text', 'VP', 'Note']
            const translated = action.payload.bonuses[card.id]
            const mergeContent = translatedKeys.reduce(
                (acc, key) => (String(translated[key]).trim() ? { ...acc, [key]: String(translated[key]).trim() } : acc), {})
            return { ...card, ...mergeContent }
        })

        return {
            ...state,
            birdCards,
            bonusCards,
            search: { birdCards: birdCardsSearch(birdCards), bonusCards: bonusCardsSearch(bonusCards) },
            // @ts-ignore
            displayedCards: birdCards.concat(bonusCards).slice(0, SLICE_WINDOW),
            // @ts-ignore
            displayedCardsHidden: birdCards.concat(bonusCards).slice(SLICE_WINDOW),
            activeBonusCards: bonusCards,
            translatedContent: action.payload.other
        }
    }),

    // @ts-ignore
    on(appActions.resetLanguage, (state, action) => {
        return {
            ...state,
            // @ts-ignore
            birdCards: BirdCards,
            // @ts-ignore
            bonusCards: BonusCards,
            // @ts-ignore
            search: { birdCards: birdCardsSearch(BirdCards), bonusCards: bonusCardsSearch(BonusCards) },
            // @ts-ignore
            displayedCards: BirdCards.concat(BonusCards).slice(0, SLICE_WINDOW),
            // @ts-ignore
            displayedCardsHidden: BirdCards.concat(BonusCards).slice(SLICE_WINDOW),
            // @ts-ignore
            activeBonusCards: BonusCards,
            translatedContent: {}
        }
    })
)

export function appReducer(state, action) {
    return reducer(state, action)
}
