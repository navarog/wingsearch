import { createReducer, on } from '@ngrx/store'
import * as appActions from './app.actions'
import {
    AppState,
    isBirdCard,
    isHummingbirdCard,
    isBirdOrHummingbirdCard,
    BirdCard,
    BonusCard,
    DisplayedStats,
    isBonusCard,
    BeakDirection,
    LeftBeakDirections,
    RightBeakDirections
} from './app.interfaces'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'
import HummingbirdCards from '../../assets/data/hummingbirds.json'
import Parameters from '../../assets/data/parameters.json'
import { birdCardsSearch, bonusCardsSearch } from './cards-search'
import { bonusSearchMap, dynamicPercentage } from './bonus-search-map'
import { CookiesService } from '../cookies.service'

const SLICE_WINDOW = 18

const BirdCardsWithHummingbirds = [...BirdCards, ...HummingbirdCards]

// @ts-ignore
const englishBirdCardsMap: BirdCard[] = BirdCardsWithHummingbirds.reduce((acc, card) => ({ ...acc, [card.id]: card }), {})
// @ts-ignore
const englishBonusCardsMap: BonusCard[] = BonusCards.reduce((acc, card) => ({ ...acc, [card.id]: card }), {})

const calculateDisplayedStats = (cards: (BirdCard | BonusCard)[]): DisplayedStats => {

    const birdCards = cards.filter(isBirdCard).length
    const bonusCards = cards.filter(isBonusCard).length
    const hummingbirdCards = cards.filter(isHummingbirdCard).length

    const habitat = cards.filter(isBirdOrHummingbirdCard).reduce((acc, val: BirdCard) => {
        acc.forest += val.Forest ? 1 : 0
        acc.grassland += val.Grassland ? 1 : 0
        acc.wetland += val.Wetland ? 1 : 0
        return acc
    }, { forest: 0, grassland: 0, wetland: 0 })

    return { birdCards, hummingbirdCards, bonusCards, habitat }
}

const eatsMustFood = (card: BirdCard, mustFood: string[]): boolean => {
    const foodKeys = ['Invertebrate', 'Seed', 'Fruit', 'Fish', 'Rodent', 'Nectar', 'Wild (food)']
    const birdFood = foodKeys.filter(key => card[key]).map(key => key.toLowerCase())
    return !!
        mustFood.every(food => birdFood.includes(food)) ||
        (!birdFood.length && mustFood.length === 1 && mustFood[0] === 'no-food')
}

const eatsMustNotFood = (card: BirdCard, mustNotFood: string[]): boolean => {
    const foodKeys = ['Invertebrate', 'Seed', 'Fruit', 'Fish', 'Rodent', 'Nectar', 'Wild (food)']
    const birdFood = foodKeys.filter(key => card[key]).map(key => key.toLowerCase())
    return !!
        mustNotFood.every(food => food === 'no-food' || !birdFood.includes(food)) &&
        (!mustNotFood.includes('no-food') || birdFood.length > 0)
}

const cookies: CookiesService = new CookiesService();

export const initialState: AppState = {
    // @ts-ignore
    birdCards: BirdCardsWithHummingbirds,
    // @ts-ignore
    bonusCards: BonusCards,
    search: {
        // @ts-ignore
        birdCards: birdCardsSearch(BirdCardsWithHummingbirds),
        // @ts-ignore
        bonusCards: bonusCardsSearch(BonusCards),
    },
    // @ts-ignore
    displayedCards: BirdCardsWithHummingbirds.concat(BonusCards).slice(0, SLICE_WINDOW),
    // @ts-ignore
    displayedCardsHidden: BirdCardsWithHummingbirds.concat(BonusCards).slice(SLICE_WINDOW),
    // @ts-ignore
    activeBonusCards: BonusCards,
    // @ts-ignore
    displayedStats: calculateDisplayedStats(BirdCardsWithHummingbirds.concat(BonusCards)),
    scrollDisabled: false,
    translatedContent: {},
    parameters: Parameters,
    expansion: {
        core: cookies.getCookie('expansion.core') !== '0',
        european: cookies.getCookie('expansion.european') !== '0',
        oceania: cookies.getCookie('expansion.oceania') !== '0',
        asia: cookies.getCookie('expansion.asia') !== '0',
        americas: cookies.getCookie('expansion.americas') !== '0',
    },
    promoPack: {
        promoAsia: cookies.getCookie('expansion.promoAsia') !== '0',
        promoCA: cookies.getCookie('expansion.promoCA') !== '0',
        promoEurope: cookies.getCookie('expansion.promoEurope') !== '0',
        promoNZ: cookies.getCookie('expansion.promoNZ') !== '0',
        promoUK: cookies.getCookie('expansion.promoUK') !== '0',
        promoUS: cookies.getCookie('expansion.promoUS') !== '0',
    },
    assetPack: cookies.getCookie('assetPack') || 'silhouette',
    playlist: {
        birdIds: JSON.parse(cookies.getCookie('playlist.birdIds') || '[]'),
        isPlaying: false,
        currentIndex: 0,
        currentBirdId: null,
        isShuffled: cookies.getCookie('playlist.isShuffled') === '1',
        volume: parseFloat(cookies.getCookie('playlist.volume') || '0.7'),
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

            displayedCards = displayedCards.filter(isBirdOrHummingbirdCard)
                .filter(card => bonusCards.reduce((acc, val) => acc && bonusSearchMap[val.id].callbackfn(card), true)
            )
        } else {
            const bonusCards = Array.from(new Set([
                'Bonus card',
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

        const allowedPromoPacks = Object.entries(action.promoPack).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        const allowedColors = Object.entries(action.colors).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        const mustFood = Object.entries(action.food).reduce(
            (acc, val) => val[1] === 1 ? [...acc, val[0]] : acc, []
        )

        const mustNotFood = Object.entries(action.food).reduce(
            (acc, val) => val[1] === 2 ? [...acc, val[0]] : acc, []
        )

        const allowedNests = Object.entries(action.nest).reduce(
            (acc, val) => val[1] ? [...acc, val[0]] : acc, []
        )

        displayedCards = displayedCards.filter(card =>
            (allowedExpansions.includes(card.Set)
                || allowedPromoPacks.includes(card.Set))
            && (isBonusCard(card) || (
                allowedColors.includes(card.Color ? card.Color.toLowerCase() : 'white')) &&
                eatsMustFood(card, mustFood) &&
                eatsMustNotFood(card, mustNotFood) &&
                allowedNests.includes(card['Nest type'])
            )
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.eggs.min <= card['Egg limit'] && action.eggs.max >= card['Egg limit'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.points.min <= card['Victory points'] && action.points.max >= card['Victory points'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || card['Wingspan'] === '*' || (action.wingspan.min <= card['Wingspan'] && action.wingspan.max >= card['Wingspan'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card) || (action.foodCost.min <= card['Total food cost'] && action.foodCost.max >= card['Total food cost'])
        )

        displayedCards = displayedCards.filter(card =>
            isBonusCard(card)
            || (action.beak?.left && action.beak?.right)
            || (action.beak?.left && LeftBeakDirections.includes(card['Beak direction']))
            || (action.beak?.right && RightBeakDirections.includes(card['Beak direction']))
            || (!action.beak?.left && !action.beak?.right && card['Beak direction'] == BeakDirection.Neither)
        )

        displayedCards = displayedCards.filter(card =>
            (isBonusCard(card) && action.stats.bonuses)
            || (((isBirdCard(card) && action.stats.birds)
                || (isHummingbirdCard(card) && action.stats.hummingbirds))
                && (
                    (
                        action.stats.habitat.forest === 0
                        || (action.stats.habitat.forest === 1 && card.Forest)
                        || (action.stats.habitat.forest === 2 && !card.Forest)
                    )
                    && (
                        action.stats.habitat.grassland === 0
                        || (action.stats.habitat.grassland === 1 && card.Grassland)
                        || (action.stats.habitat.grassland === 2 && !card.Grassland)
                    )
                    && (
                        action.stats.habitat.wetland === 0
                        || (action.stats.habitat.wetland === 1 && card.Wetland)
                        || (action.stats.habitat.wetland === 2 && !card.Wetland)
                    )
                )
            )
        )

        const displayedStats = calculateDisplayedStats(displayedCards)

        const displayedCardsHidden = displayedCards.slice(SLICE_WINDOW)
        displayedCards = displayedCards.slice(0, SLICE_WINDOW)

        return { ...state, displayedCards, displayedCardsHidden, displayedStats, scrollDisabled: false, expansion: action.expansion }
    }),

    on(appActions.bonusCardSearch, (state, action) => {
        let activeBonusCards = Array.from(new Set([
            'Bonus card',
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
            .filter(card => action.expansion[card.Set])

        return { ...state, activeBonusCards }
    }),

    on(appActions.scroll, (state, action) => {
        const displayedCards = state.displayedCards.concat(state.displayedCardsHidden.slice(0, SLICE_WINDOW))
        const displayedCardsHidden = state.displayedCardsHidden.slice(SLICE_WINDOW)

        return { ...state, displayedCards, displayedCardsHidden, scrollDisabled: !displayedCardsHidden.length }
    }),

    on(appActions.setLanguage, (state, action) => {
        const translateBirds = (card: BirdCard) => {
            const translatedKeys = ['Common name', 'Power text', 'Flavor text', 'Note']
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
            const renameKeys = {'Name': 'Bonus card'}
            const translated = Object.keys(action.payload.bonuses[card.id] || {}).reduce((acc, key) => ({...acc, [renameKeys[key] || key]: action.payload.bonuses[card.id][key]}), {})
            const translatedKeys = ['Bonus card', 'Condition', 'Explanatory text', 'VP', 'Note']
            const englishBonus = englishBonusCardsMap[card.id]

            if (!translated)
                return englishBonus

            const mergeContent = translatedKeys.reduce((acc, key) =>
                (translated[key] && String(translated[key]).trim() ? { ...acc, [key]: String(translated[key]).trim() } : acc), {})

            return { ...englishBonus, ...mergeContent }
        }

        const sortCardsByKey = (key: string, automaLast = false) => {
            if (automaLast)
                return (a, b) => ((Number(!!a['Bonus card'].match(/\[automa\]/)) - Number(!!b['Bonus card'].match(/\[automa\]/))) ||
                    a[key].localeCompare(b[key], action.language))
            else
                return (a, b) => a[key].localeCompare(b[key], action.language)
        }

        // @ts-ignore
        const birdCards: BirdCard[] = BirdCardsWithHummingbirds.map(translateBirds).sort(sortCardsByKey('Common name'))

        // @ts-ignore
        const bonusCards: BonusCard[] = BonusCards.map(translateBonuses).sort(sortCardsByKey('Bonus card', true))

        const displayedAndHiddenCards = state.displayedCards.concat(state.displayedCardsHidden)
        const displayedBirds = displayedAndHiddenCards.filter(isBirdOrHummingbirdCard)
            .map(translateBirds).sort(sortCardsByKey('Common name'))
        const displayedBonuses = displayedAndHiddenCards.filter(isBonusCard)
            .map(translateBonuses).sort(sortCardsByKey('Bonus card', true))
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
            parameters: action.payload.parameters,
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
                return (a, b) => ((Number(!!a['Bonus card'].match(/\[automa\]/)) - Number(!!b['Bonus card'].match(/\[automa\]/))) ||
                    a[key].localeCompare(b[key], 'en'))
            else
                return (a, b) => a[key].localeCompare(b[key], 'en')
        }

        const displayedAndHiddenCards = state.displayedCards.concat(state.displayedCardsHidden)
        const displayedBirds = displayedAndHiddenCards.filter(isBirdOrHummingbirdCard)
            .map(birdToEnglish).sort(sortCardsByKey('Common name'))
        const displayedBonuses = displayedAndHiddenCards.filter(isBonusCard)
            .map(bonusToEnglish).sort(sortCardsByKey('Bonus card', true))
            // @ts-ignore
            .map(dynamicPercentage(BirdCardsWithHummingbirds, action.expansion))

        return {
            ...state,
            // @ts-ignore
            birdCards: BirdCardsWithHummingbirds,
            // @ts-ignore
            bonusCards: BonusCards,
            // @ts-ignore
            search: { birdCards: birdCardsSearch(BirdCardsWithHummingbirds), bonusCards: bonusCardsSearch(BonusCards) },
            // @ts-ignore
            displayedCards: displayedBirds.concat(displayedBonuses).slice(0, SLICE_WINDOW),
            // @ts-ignore
            displayedCardsHidden: displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW),
            // @ts-ignore
            activeBonusCards: BonusCards.filter(eb => state.activeBonusCards.find(b => b.id === eb.id)),
            translatedContent: {},
            parameters: Parameters,
            // @ts-ignore
            scrollDisabled: !displayedBirds.concat(displayedBonuses).slice(SLICE_WINDOW).length
        }
    }),

    on(appActions.changeAssetPack, (state, action) => {
        return {
            ...state,
            assetPack: action.assetPack
        }
    }),

    // Playlist reducers
    on(appActions.addToPlaylist, (state, action) => {
        const isAlreadyInPlaylist = state.playlist.birdIds.includes(action.birdId)
        if (isAlreadyInPlaylist) {
            return state
        }

        const newBirdIds = [...state.playlist.birdIds, action.birdId]
        cookies.setCookie('playlist.birdIds', JSON.stringify(newBirdIds), 365)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                birdIds: newBirdIds
            }
        }
    }),

    on(appActions.addToPlaylistAndPlay, (state, action) => {
        // Add to playlist if not already there
        const isAlreadyInPlaylist = state.playlist.birdIds.includes(action.birdId)
        let newBirdIds = state.playlist.birdIds

        if (!isAlreadyInPlaylist) {
            newBirdIds = [...state.playlist.birdIds, action.birdId]
            cookies.setCookie('playlist.birdIds', JSON.stringify(newBirdIds), 365)
        }

        // Set this bird as current and start playing
        const currentIndex = newBirdIds.indexOf(action.birdId)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                birdIds: newBirdIds,
                isPlaying: true,
                        currentIndex,
                currentBirdId: action.birdId
            }
        }
    }),

    on(appActions.removeFromPlaylist, (state, action) => {
        const newBirdIds = state.playlist.birdIds.filter(id => id !== action.birdId)
        const wasCurrentSong = state.playlist.currentBirdId === action.birdId
        const newCurrentIndex = wasCurrentSong ? 0 : state.playlist.currentIndex
        const newCurrentBirdId = wasCurrentSong ? null : state.playlist.currentBirdId

        cookies.setCookie('playlist.birdIds', JSON.stringify(newBirdIds), 365)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                birdIds: newBirdIds,
                currentIndex: newCurrentIndex,
                currentBirdId: newCurrentBirdId,
                isPlaying: newBirdIds.length === 0 ? false : state.playlist.isPlaying
            }
        }
    }),

    on(appActions.clearPlaylist, (state) => {
        cookies.setCookie('playlist.birdIds', '[]', 365)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                birdIds: [],
                isPlaying: false,
                currentIndex: 0,
                currentBirdId: null
            }
        }
    }),

    on(appActions.startPlaylist, (state) => {
        if (state.playlist.birdIds.length === 0) {
            return state
        }

        // Set currentBirdId if it's not set yet, or if current bird is no longer in playlist
        let currentBirdId = state.playlist.currentBirdId
        let currentIndex = state.playlist.currentIndex

        if (currentBirdId === null || !state.playlist.birdIds.includes(currentBirdId)) {
            // Start with first bird or random bird if shuffle is enabled
            currentIndex = state.playlist.isShuffled
                ? Math.floor(Math.random() * state.playlist.birdIds.length)
                : 0
            currentBirdId = state.playlist.birdIds[currentIndex]
        }

        return {
            ...state,
            playlist: {
                ...state.playlist,
                isPlaying: true,
                        currentIndex,
                currentBirdId
            }
        }
    }),

    on(appActions.pausePlaylist, (state) => {
        return {
            ...state,
            playlist: {
                ...state.playlist,
                isPlaying: false
            }
        }
    }),

    on(appActions.resumePlaylist, (state) => {
        return {
            ...state,
            playlist: {
                ...state.playlist,
                isPlaying: true,
                    }
        }
    }),

    on(appActions.stopPlaylist, (state) => {
        return {
            ...state,
            playlist: {
                ...state.playlist,
                isPlaying: false,
                currentIndex: 0,
                currentBirdId: null,
                    }
        }
    }),

    on(appActions.nextSong, (state) => {
        if (state.playlist.birdIds.length === 0) {
            return state
        }

        const nextIndex = state.playlist.isShuffled
            ? Math.floor(Math.random() * state.playlist.birdIds.length)
            : (state.playlist.currentIndex + 1) % state.playlist.birdIds.length

        return {
            ...state,
            playlist: {
                ...state.playlist,
                currentIndex: nextIndex,
                currentBirdId: state.playlist.birdIds[nextIndex]
            }
        }
    }),

    on(appActions.toggleShuffle, (state) => {
        const newShuffleState = !state.playlist.isShuffled
        cookies.setCookie('playlist.isShuffled', newShuffleState ? '1' : '0', 365)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                isShuffled: newShuffleState
            }
        }
    }),


    on(appActions.playlistSongEnded, (state) => {
        if (state.playlist.birdIds.length === 0) {
            return {
                ...state,
                playlist: {
                    ...state.playlist,
                    isPlaying: false,
                    currentBirdId: null
                }
            }
        }

        const nextIndex = state.playlist.isShuffled
            ? Math.floor(Math.random() * state.playlist.birdIds.length)
            : (state.playlist.currentIndex + 1) % state.playlist.birdIds.length

        return {
            ...state,
            playlist: {
                ...state.playlist,
                currentIndex: nextIndex,
                currentBirdId: state.playlist.birdIds[nextIndex]
            }
        }
    }),

    on(appActions.setPlaylistVolume, (state, action) => {
        cookies.setCookie('playlist.volume', action.volume.toString(), 365)

        return {
            ...state,
            playlist: {
                ...state.playlist,
                volume: action.volume
            }
        }
    })
)

export function appReducer(state, action) {
    return reducer(state, action)
}
