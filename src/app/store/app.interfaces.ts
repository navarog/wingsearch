export interface AppState {
    birdCards: BirdCard[]
    bonusCards: BonusCard[]
    search: {
        birdCards: any
        bonusCards: any
    }
    displayedCards: (BirdCard | BonusCard)[]
    displayedCardsHidden: (BirdCard | BonusCard)[]
    activeBonusCards: BonusCard[]
    displayedStats: DisplayedStats
    scrollDisabled: boolean
    translatedContent: { [key: string]: { Translated: string } }
}

export interface BirdCard {
    id: number
    'Common name': string
    'Scientific name': string
    Expansion: Expansion
    Color: Color | null
    PowerCategory: PowerCategory | null
    'Power text': null | string
    Note: null | string
    Predator: string | null
    Flocking: string | null
    'Bonus card': string | null
    'Victory points': number
    'Nest type': NestType
    'Egg capacity': number
    Wingspan: string
    Forest: string | null
    Grassland: string | null
    Wetland: string | null
    Invertebrate: number | null
    Seed: number | null
    Fruit: number | null
    Fish: number | null
    Nectar: number | null
    Rodent: number | null
    'Wild (food)': number | null
    '/ (food cost)': string | null
    '* (food cost)': string | null
    'Total food cost': number
    Anatomist: string | null
    Cartographer: string | null
    Historian: string | null
    Photographer: string | null
    'Backyard Birder': string | null
    'Bird Bander': string | null
    'Bird Counter': string | null
    'Bird Feeder': string | null
    'Caprimulgiform Specialist': string | null
    'Diet Specialist': string | null
    'Enclosure Builder': string | null
    Falconer: string | null
    'Fishery Manager': string | null
    'Food Web Expert': string | null
    Forester: string | null
    'Large Bird Specialist': string | null
    'Nest Box Builder': string | null
    'Omnivore Expert': string | null
    'Passerine Specialist': string | null
    'Platform Builder': string | null
    'Prairie Manager': string | null
    Rodentologist: string | null
    rulings: Ruling[]
    additionalRulings: Ruling[]
    Viticulturalist: string | null
    'Wetland Scientist': string | null
    'Wildlife Gardener': string | null
    'Small Clutch Specialist': string | null
    'Endangered Species Protector': string | null
    'Beak Pointing Left': string | null
    'Beak Pointing Right': string | null
    isBirdCard: () => true
    isBonusCard: () => false
}

export function isBirdCard(object: any): object is BirdCard {
    return 'Common name' in object
}

export enum Color {
    Brown = 'Brown',
    Pink = 'Pink',
    Teal = 'Teal',
    White = 'White',
}

export enum NestType {
    Bowl = 'Bowl',
    Cavity = 'Cavity',
    Ground = 'Ground',
    None = 'None',
    Platform = 'Platform',
    Wild = 'Wild',
}

export enum PowerCategory {
    CachingFood = 'Caching Food',
    CardDrawing = 'Card-drawing',
    EggLaying = 'Egg-laying',
    Flocking = 'Flocking',
    FoodFromBirdfeeder = 'Food from Birdfeeder',
    FoodFromSupply = 'Food from Supply',
    FoodRelated = 'Food-related',
    HuntingAndFishing = 'Hunting and Fishing',
    HuntingFishing = 'Hunting/Fishing',
    Other = 'Other',
    PowerCategoryHuntingAndFishing = 'Hunting and fishing',
    Tucking = 'Tucking',
}

export interface Ruling {
    text: string
    source: string
}

export interface BonusCard {
    id: number
    Name: string
    Expansion: Expansion
    Automa: string | null
    Condition: string
    'Explanatory text': null | string
    VP: string
    '%': number | string
    Note: null | string
    'VP Average': number
    birdIds?: number[]
    rulings: Ruling[]
    additionalRulings: Ruling[]
    isBirdCard: () => false
    isBonusCard: () => true
}

export function isBonusCard(object: any): object is BonusCard {
    return 'Condition' in object
}

export enum Expansion {
    Core = 'originalcore',
    Swiftstart = 'swiftstart',
    European = 'european',
    Oceania = 'oceania',
    Asia = 'asia',
}

export interface DisplayedStats {
    birdCards: number
    bonusCards: number
    habitat: {
        forest: number
        grassland: number
        wetland: number
    }
}
