import { BirdCard } from './app.interfaces'
import { BonusCard } from './app.interfaces'
import { Expansion } from './app.interfaces'

export class BonusMatch {
  constructor(public isPercentage: boolean, public callbackfn: (birdCard: BirdCard) => boolean) { }
}

export const bonusSearchMap = {
    1000: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Anatomist
    }),
    1001: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Victory points'] < 4 || !!birdCard['Backyard Birder']
    }),
    1002: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1003: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Bird Bander']
    }),
    1004: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Flocking
    }),
    1005: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Seed || !!birdCard['Bird Feeder']
    }),
    1006: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] >= 4
    }),
    1007: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Cartographer
    }),
    1008: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Flocking
    }),
    1009: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Diet Specialist']
    }),
    1010: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1011: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Enclosure Builder']
    }),
    1012: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1013: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Falconer
    }),
    1014: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Fish || !!birdCard['Fishery Manager']
    }),
    1015: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Food Web Expert']
    }),
    1016: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Forester
    }),
    1017: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Historian
    }),
    1018: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Large Bird Specialist']
    }),
    1019: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Nest Box Builder']
    }),
    1020: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Wild (food)'] > 0 || !!birdCard['Omnivore Expert']
    }),
    1021: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] > 0
    }),
    1022: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Passerine Specialist']
    }),
    1023: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Photographer
    }),
    1024: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Platform Builder']
    }),
    1025: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Prairie Manager']
    }),
    1026: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Rodent || !!birdCard.Rodentologist
    }),
    1027: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1028: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Fruit || !!birdCard.Viticulturalist
    }),
    1029: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Wetland Scientist']
    }),
    1030: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Wildlife Gardener']
    }),
    1031: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Caprimulgiform Specialist']
    }),
    1032: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Victory points'] === 3 || birdCard['Victory points'] === 4
    }),
    1033: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Victory points'] >= 5 && birdCard['Victory points'] <= 7
    }),
    1034: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Forest
    }),
    1035: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Grassland
    }),
    1036: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1037: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1038: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Wetland
    }),
    1039: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] > 0
    }),
    1040: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Bonus card'] || !!birdCard['Endangered Species Protector']
    }),
    1041: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'wild' && !!birdCard.Forest
    }),
    1042: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Forest
    }),
    1043: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'wild' && !!birdCard.Grassland
    }),
    1044: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Grassland
    }),
    1045: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard['Power text']?.match(/((([Cc]ache)|([Cc]aching)) [1-9] .*\[(rodent|fish|wild)\])|(\[(rodent|fish|wild)\].*(([Cc]ache)|([Cc]aching)))/)
    }),
    1046: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Egg capacity'] <= 2
    }),
    1047: new BonusMatch(true, (birdCard: BirdCard) => {
        return birdCard['Nest type'] === 'wild' && !!birdCard.Wetland
    }),
    1048: new BonusMatch(true, (birdCard: BirdCard) => {
        return !!birdCard.Wetland
    }),
    1049: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1050: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
    1051: new BonusMatch(false, (birdCard: BirdCard) => {
        return true
    }),
}

function getPercentage(card: BonusCard, selectedBirds: BirdCard[]): number | string
{
  const bonusMatch: BonusMatch = bonusSearchMap[card.id];
  if (!bonusMatch.isPercentage || selectedBirds.length === 0)
    return '-';
  return (selectedBirds.filter(birdCard => bonusMatch.callbackfn(birdCard)).length / selectedBirds.length * 100).toFixed(1);
}

export function dynamicPercentage(birds: BirdCard[], expansion: Expansion) {
  const allowedExpansions = Object.entries(expansion).reduce(
    (acc, val) => val[1] ? [...acc, val[0]] : acc, []
  )

  const selectedBirds = birds.filter(card => allowedExpansions.includes(card.Expansion))

  return (card: BonusCard) =>
  {
    return { ...card, '%': getPercentage(card, selectedBirds) }
  }
}
