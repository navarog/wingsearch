import { BirdCard } from './app.interfaces'

export const bonusSearchMap = {
    1000: (birdCard: BirdCard) => {
        return !!birdCard.Anatomist
    },
    1001: (birdCard: BirdCard) => {
        return birdCard['Victory points'] < 4
    },
    1002: (birdCard: BirdCard) => {
        return true
    },
    1003: (birdCard: BirdCard) => {
        return !!birdCard['Bird Bander']
    },
    1004: (birdCard: BirdCard) => {
        return !!birdCard.Flocking
    },
    1005: (birdCard: BirdCard) => {
        return !!birdCard.Seed
    },
    1006: (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] >= 4
    },
    1007: (birdCard: BirdCard) => {
        return !!birdCard['Citizen Scientist']
    },
    1008: (birdCard: BirdCard) => {
        return !!birdCard['Diet Specialist']
    },
    1009: (birdCard: BirdCard) => {
        return true
    },
    1010: (birdCard: BirdCard) => {
        return !!birdCard['Enclosure Builder']
    },
    1011: (birdCard: BirdCard) => {
        return true
    },
    1012: (birdCard: BirdCard) => {
        return !!birdCard.Falconer
    },
    1013: (birdCard: BirdCard) => {
        return !!birdCard['Fishery Manager']
    },
    1014: (birdCard: BirdCard) => {
        return !!birdCard['Food Web Expert']
    },
    1015: (birdCard: BirdCard) => {
        return !!birdCard.Forester
    },
    1016: (birdCard: BirdCard) => {
        return !!birdCard.Historian
    },
    1017: (birdCard: BirdCard) => {
        return !!birdCard['Large Bird Specialist']
    },
    1018: (birdCard: BirdCard) => {
        return !!birdCard['Nest Box Builder']
    },
    1019: (birdCard: BirdCard) => {
        return !!birdCard['Omnivore Expert']
    },
    1020: (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] > 0
    },
    1021: (birdCard: BirdCard) => {
        return !!birdCard['Passerine Specialist']
    },
    1022: (birdCard: BirdCard) => {
        return !!birdCard.Photographer
    },
    1023: (birdCard: BirdCard) => {
        return !!birdCard['Platform Builder']
    },
    1024: (birdCard: BirdCard) => {
        return !!birdCard['Prairie Manager']
    },
    1025: (birdCard: BirdCard) => {
        return !!birdCard.Rodentologist
    },
    1026: (birdCard: BirdCard) => {
        return true
    },
    1027: (birdCard: BirdCard) => {
        return !!birdCard.Viticulturalist
    },
    1028: (birdCard: BirdCard) => {
        return !!birdCard['Wetland Scientist']
    },
    1029: (birdCard: BirdCard) => {
        return !!birdCard['Wildlife Gardener']
    },
    1031: (birdCard: BirdCard) => {
        return birdCard['Victory points'] === 3 || birdCard['Victory points'] === 4
    },
    1032: (birdCard: BirdCard) => {
        return birdCard['Victory points'] >= 6 || birdCard['Victory points'] <= 7
    },
}
