import { createReducer, on } from '@ngrx/store'
import * as appActions from './app.actions'
import { AppState, isBirdCard, BirdCard, BonusCard, DisplayedStats, isBonusCard, Expansion } from './app.interfaces'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'
import { birdCardsSearch, bonusCardsSearch } from './cards-search'
import { bonusSearchMap, dynamicPercentage } from './bonus-search-map'
import { CookiesService } from '../cookies.service'


const SLICE_WINDOW = 18

// @ts-ignore
const englishBirdCardsMap: BirdCard[] = BirdCards.reduce((acc, card) => ({ ...acc, [card.id]: card }), {})
// @ts-ignore
const englishBonusCardsMap: BonusCard[] = BonusCards.reduce((acc, card) => ({ ...acc, [card.id]: card }), {})

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

const eatsMustFood = (card: BirdCard, mustFood: string[]): boolean => {
    const foodKeys = ['Invertebrate', 'Seed', 'Fruit', 'Fish', 'Rodent', 'Nectar', 'Wild (food)']
    const birdFood = foodKeys.filter(key => card[key]).map(key => key.toLowerCase())
    return !!mustFood.every(food => birdFood.includes(food)) || (!birdFood.length && mustFood.length === 1 && mustFood[0] === 'no-food')
}

const cookies: CookiesService = new CookiesService();

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
    translatedContent: {},
    expansion: {
      asia: cookies.getCookie('expansion.asia') !== '0',
      oceania: cookies.getCookie('expansion.oceania') !== '0',
      european: cookies.getCookie('expansion.european') !== '0',
      swiftstart: cookies.getCookie('expansion.swiftstart') !== '0',
      originalcore: cookies.getCookie('expansion.core') !== '0',
    }
}

const reducer = createReducer(
    initialState,
    on(appActions.search, (state, action) => {
        let displayedCards = Array.from(new Set([
            'Common name',
            'Scientific name',
            'Power text',
        ].reduce((acc, val) => {
            return [
                ...acc,
                ...state.search.birdCards.search({
                    query: action.main, field: val
                })
            ]
        }, [])))

        if (!displayedCards.length && !action.main) {
            // @ts-ignore
            displayedCards = state.birdCards.concat(state.bonusCards.map(dynamicPercentage(state.birdCards, action.expansion)))
        }

        if (action.bonus.length) {
            const bonusCards = state.bonusCards.filter(card => action.bonus.includes(card.id))

            displayedCards = displayedCards.filter(isBirdCard).filter(card =>
                bonusCards.reduce((acc, val) => acc && bonusSearchMap[val.id].callbackfn(card), true)
            )
        } else {
            const bonusCards = Array.from(new Set([
                'Name',
                'Condition',
                'VP',
            ].reduce((acc, val) => {
                return [
                    ...acc,
                    ...state.search.bonusCards.search({
                        query: action.main, field: val
                    })
                ]
            }, [])))

            displayedCards = displayedCards.concat(bonusCards.map(dynamicPercentage(state.birdCards, action.expansion)))
        }

        const allowedExpansions = Object.entries(action.expansion).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        const allowedColors = Object.entries(action.colors).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        const mustFood = Object.entries(action.food).reduce(
            (acc, val) => !val[1] ? acc : [...acc, val[0]], []
        )

        const allowedNests = Object.entries(action.nest).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        displayedCards = displayedCards.filter(card =>
            allowedExpansions.includes(card.Expansion) && (isBonusCard(card) || (
                allowedColors.includes(card.Color ? card.Color.toLowerCase() : 'white')) &&
                eatsMustFood(card, mustFood) &&
                allowedNests.includes(card['Nest type'])
            )
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.eggs.min <= card['Egg capacity'] && action.eggs.max >= card['Egg capacity'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.points.min <= card['Victory points'] && action.points.max >= card['Victory points'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || card['Wingspan'] === '*' || (action.wingspan.min <= card['Wingspan'] && action.wingspan.max >= card['Wingspan'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) ||  (action.foodCost.min <= card['Total food cost'] && action.foodCost.max >= card['Total food cost'])
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

        return { ...state, displayedCards, displayedCardsHidden, displayedStats, scrollDisabled: false, expansion: action.expansion }
    }),

    on(appActions.bonusCardSearch, (state, action) => {
        let activeBonusCards = Array.from(new Set([
            'Name',
            'Condition',
            'VP',
        ].reduce((acc, val) => {
            return [
                ...acc,
                ...state.search.bonusCards.search({
                    query: action.bonusfield, field: val
                })
            ]
        }, [])))

        if (!activeBonusCards.length && !action.bonusfield) {
            // @ts-ignore
            activeBonusCards = state.bonusCards
        }

        activeBonusCards = activeBonusCards
            .filter(card => !action.bonus.includes(card.id))
            .filter(card => action.expansion[card.Expansion])

        return { ...state, activeBonusCards }
    }),

    on(appActions.scroll, (state, action) => {
        const displayedCards = state.displayedCards.concat(state.displayedCardsHidden.slice(0, SLICE_WINDOW))
        const displayedCardsHidden = state.displayedCardsHidden.slice(SLICE_WINDOW)

        return { ...state, displayedCards, displayedCardsHidden, scrollDisabled: !displayedCardsHidden.length }
    }),

    on(appActions.setLanguage, (state, action) => {
        const translateBirds = (card: BirdCard) => {
            const translatedKeys = ['Common name', 'Power text', 'Note']
            const bonusKeys = ['Anatomist', 'Cartographer', 'Historian', 'Photographer']
            const translated = action.payload.birds[card.id]
            const englishBird = englishBirdCardsMap[card.id]

            if (!translated)
                return englishBird

            const mergeContent = translatedKeys.reduce((acc, key) =>
                (translated[key] && String(translated[key]).trim() ? { ...acc, [key]: String(translated[key]).trim() } : acc), {})

            const bonuses = bonusKeys.reduce((acc, key) => ({...acc, [key]: translated[key]}), {})
            return { ...englishBird, ...mergeContent, ...bonuses }
        }

        const translateBonuses = (card: BonusCard) => {
            const translatedKeys = ['Name', 'Condition', 'Explanatory text', 'VP', 'Note']
            const translated = action.payload.bonuses[card.id]
            const englishBonus = englishBonusCardsMap[card.id]

            if (!translated)
                return englishBonus

            const mergeContent = translatedKeys.reduce((acc, key) =>
                (translated[key] && String(translated[key]).trim() ? { ...acc, [key]: String(translated[key]).trim() } : acc), {})

            return { ...englishBonus, ...mergeContent }
        }

        const sortCardsByKey = (key: string, automaLast = false) => {
            if (automaLast)
                return (a, b) => ((Number(!!a.Name.match(/\[automa\]/)) - Number(!!b.Name.match(/\[automa\]/))) ||
                    a[key].localeCompare(b[key], action.language))
            else
                return (a, b) => a[key].localeCompare(b[key], action.language)
        }

        // @ts-ignore
        const birdCards: BirdCard[] = BirdCards.map(translateBirds).sort(sortCardsByKey('Common name'))

        // @ts-ignore
        const bonusCards: BonusCard[] = BonusCards.map(translateBonuses).sort(sortCardsByKey('Name', true))

        const displayedAndHiddenCards = state.displayedCards.concat(state.displayedCardsHidden)
        const displayedBirds = displayedAndHiddenCards.filter((card) => isBirdCard(card))
            .map(translateBirds).sort(sortCardsByKey('Common name'))
        const displayedBonuses = displayedAndHiddenCards.filter((card) => isBonusCard(card))
            .map(translateBonuses).sort(sortCardsByKey('Name', true))
            .map(dynamicPercentage(birdCards, action.expansion))

        return {
            ...state,
            birdCards,
            bonusCards,
            search: { birdCards: birdCardsSearch(birdCards), bonusCards: bonusCardsSearch(bonusCards) },
            // @ts-ignore
            displayedCards: displayedBirds.concat(displayedBonuses).slice(0, SLICE_WINDOW),
            // @ts-ignore
            displayedCardsHidden: displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW),
            activeBonusCards: bonusCards.filter(b => state.activeBonusCards.find(ab => b.id === ab.id)),
            translatedContent: action.payload.other,
            // @ts-ignore
            scrollDisabled: !displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW).length
        }
    }),

    // @ts-ignore
    on(appActions.resetLanguage, (state, action) => {
        const birdToEnglish = (bird: BirdCard) => {
            return englishBirdCardsMap[bird.id]
        }

        const bonusToEnglish = (bonus: BonusCard) => {
            return englishBonusCardsMap[bonus.id]
        }

        const sortCardsByKey = (key: string, automaLast = false) => {
            if (automaLast)
                return (a, b) => ((Number(!!a.Name.match(/\[automa\]/)) - Number(!!b.Name.match(/\[automa\]/))) ||
                    a[key].localeCompare(b[key], 'en'))
            else
                return (a, b) => a[key].localeCompare(b[key], 'en')
        }

        const displayedAndHiddenCards = state.displayedCards.concat(state.displayedCardsHidden)
        const displayedBirds = displayedAndHiddenCards.filter((card) => isBirdCard(card))
            .map(birdToEnglish).sort(sortCardsByKey('Common name'))
        const displayedBonuses = displayedAndHiddenCards.filter((card) => isBonusCard(card))
            .map(bonusToEnglish).sort(sortCardsByKey('Name', true))
            // @ts-ignore
            .map(dynamicPercentage(BirdCards, action.expansion))

        return {
            ...state,
            // @ts-ignore
            birdCards: BirdCards,
            // @ts-ignore
            bonusCards: BonusCards,
            // @ts-ignore
            search: { birdCards: birdCardsSearch(BirdCards), bonusCards: bonusCardsSearch(BonusCards) },
            // @ts-ignore
            displayedCards: displayedBirds.concat(displayedBonuses).slice(0, SLICE_WINDOW),
            // @ts-ignore
            displayedCardsHidden: displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW),
            // @ts-ignore
            activeBonusCards: BonusCards.filter(eb => state.activeBonusCards.find(b => b.id === eb.id)),
            translatedContent: {},
            // @ts-ignore
            scrollDisabled: !displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW).length
        }
    })
)

export function appReducer(state, action) {
    return reducer(state, action)
}
