import FlexSearch from 'flexsearch'
import { BirdCard, BonusCard } from './app.interfaces'

export const birdCardsSearch = (cards: BirdCard[]) => {
    const search = FlexSearch.create({
        doc: {
            id: 'id',
            field: {
                'Common name': {
                    encode: 'icase',
                    tokenize: 'full',
                    threshold: false,
                },
                'Scientific name': {
                    encode: 'icase',
                    tokenize: 'full',
                    threshold: false
                },
                'Power text': {
                    encode: 'icase',
                    tokenize: 'reverse',
                    threshold: 3,
                    resolution: 9
                },
            }
        }
    })

    search.add(cards)
    return search
}

export const bonusCardsSearch = (cards: BonusCard[]) => {
    const search = FlexSearch.create({
        doc: {
            id: 'id',
            field: {
                Name: {
                    encode: 'icase',
                    tokenize: 'full',
                    threshold: false,
                },
                Condition: {
                    encode: 'icase',
                    tokenize: 'reverse',
                    threshold: 3,
                    resolution: 9
                },
                VP: {
                    encode: 'icase',
                    tokenize: 'reverse',
                    threshold: 3,
                    resolution: 9
                },
            }
        }
    })

    search.add(cards)
    return search
}
