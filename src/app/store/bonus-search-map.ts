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
        return !!birdCard.Cartographer
    },
    1008: (birdCard: BirdCard) => {
        return !!birdCard.Flocking
    },
    1009: (birdCard: BirdCard) => {
        return !!birdCard['Diet Specialist']
    },
    1010: (birdCard: BirdCard) => {
        return true
    },
    1011: (birdCard: BirdCard) => {
        return !!birdCard['Enclosure Builder']
    },
    1012: (birdCard: BirdCard) => {
        return true
    },
    1013: (birdCard: BirdCard) => {
        return !!birdCard.Falconer
    },
    1014: (birdCard: BirdCard) => {
        return !!birdCard['Fishery Manager']
    },
    1015: (birdCard: BirdCard) => {
        return !!birdCard['Food Web Expert']
    },
    1016: (birdCard: BirdCard) => {
        return !!birdCard.Forester
    },
    1017: (birdCard: BirdCard) => {
        return !!birdCard.Historian
    },
    1018: (birdCard: BirdCard) => {
        return !!birdCard['Large Bird Specialist']
    },
    1019: (birdCard: BirdCard) => {
        return !!birdCard['Nest Box Builder']
    },
    1020: (birdCard: BirdCard) => {
        return !!birdCard['Omnivore Expert']
    },
    1021: (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] > 0
    },
    1022: (birdCard: BirdCard) => {
        return !!birdCard['Passerine Specialist']
    },
    1023: (birdCard: BirdCard) => {
        return !!birdCard.Photographer
    },
    1024: (birdCard: BirdCard) => {
        return !!birdCard['Platform Builder']
    },
    1025: (birdCard: BirdCard) => {
        return !!birdCard['Prairie Manager']
    },
    1026: (birdCard: BirdCard) => {
        return !!birdCard.Rodentologist
    },
    1027: (birdCard: BirdCard) => {
        return true
    },
    1028: (birdCard: BirdCard) => {
        return !!birdCard.Viticulturalist
    },
    1029: (birdCard: BirdCard) => {
        return !!birdCard['Wetland Scientist']
    },
    1030: (birdCard: BirdCard) => {
        return !!birdCard['Wildlife Gardener']
    },
    1031: (birdCard: BirdCard) => {
        return birdCard['Victory points'] === 3 || birdCard['Victory points'] === 4
    },
    1032: (birdCard: BirdCard) => {
        return birdCard['Victory points'] >= 6 || birdCard['Victory points'] <= 7
    },
    1033: (birdCard: BirdCard) => {
        return !!birdCard.Forest
    },
    1034: (birdCard: BirdCard) => {
        return !!birdCard.Grassland
    },
    1035: (birdCard: BirdCard) => {
        return true
    },
    1036: (birdCard: BirdCard) => {
        return true
    },
    1037: (birdCard: BirdCard) => {
        return !!birdCard.Wetland
    },
    1038: (birdCard: BirdCard) => {
        return !!birdCard['Caprimulgiform Specialist']
    },
    1039: (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] > 0
    },
    1040: (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] <= 2
    },
    1041: (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'Wild' || !!birdCard['Forest']
    },
    1042: (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'Wild' || !!birdCard['Grassland']
    },
    1043: (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'Wild' || !!birdCard['Wetland']
    },
    1044: (birdCard: BirdCard) => {
        return true
    },
    1045: (birdCard: BirdCard) => {
        return !!birdCard['Power text']?.match(/(cache [1-9] \[(rodent|fish|wild)\])|(\[(rodent|fish|wild)\].*cache it)/)
    },
    1046: (birdCard: BirdCard) => {
        return !!birdCard['Endangered Species Protector']
    },
    1047: (birdCard: BirdCard) => {
        return !!birdCard['Forest']
    },
    1048: (birdCard: BirdCard) => {
        return !!birdCard['Grassland']
    },
    1049: (birdCard: BirdCard) => {
        return !!birdCard['Wetland']
    },
    1050: (birdCard: BirdCard) => {
        return true
    },
    1051: (birdCard: BirdCard) => {
        return true
    },
}
