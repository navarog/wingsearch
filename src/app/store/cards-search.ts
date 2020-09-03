import FlexSearch from 'flexsearch'
import BirdCards from '../../assets/data/master.json'
import BonusCards from '../../assets/data/bonus.json'

export const birdCardsSearch = FlexSearch.create({
    doc: {
        id: 'id',
        field: [
            'Common name',
            'Scientific name',
            'Power text',
        ]
    }
})

birdCardsSearch.add(BirdCards)

export const bonusCardsSearch = FlexSearch.create({
    doc: {
        id: 'id',
        field: [
            'Name',
            'Condition',
            'VP',
        ]
    }
})

bonusCardsSearch.add(BonusCards)
