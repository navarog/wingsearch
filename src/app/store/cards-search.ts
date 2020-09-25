import FlexSearch from 'flexsearch'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'

export const birdCardsSearch = FlexSearch.create({
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

birdCardsSearch.add(BirdCards)

export const bonusCardsSearch = FlexSearch.create({
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

bonusCardsSearch.add(BonusCards)
