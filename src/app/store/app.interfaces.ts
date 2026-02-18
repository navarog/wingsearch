export interface PlaylistState {
    birdIds: number[]           // Array of bird IDs in playlist order
    isPlaying: boolean          // Background playlist playback state
    currentIndex: number        // Currently playing bird index
    currentBirdId: number | null // Current bird ID being played
    isShuffled: boolean         // Whether to randomize playback order
    volume: number              // Playlist volume (0-1, default 0.7)
}

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
    expansion: Expansion
    swiftstart: boolean
    promoPack: PromoPack
    displayedStats: DisplayedStats
    scrollDisabled: boolean
    translatedContent: { [key: string]: { Translated: string } }
    parameters: { [key: string]: {Value: unknown} }
    assetPack: string
    playlist: PlaylistState
}

export interface BirdCard {
    id: number
    'Common name': string
    'Native name': String
    'Scientific name': string
    Set: ExpansionType
    Pack: PackType
    Color: Color | null
    PowerCategory: PowerCategory | null
    'Power text': null | string
    Note: null | string
    Group: GroupType
    Benefit: BenefitType
    Predator: string | null
    Flocking: string | null
    'Bonus card': string | null
    'Victory points': number
    'Nest type': NestType
    'Egg limit': number
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
    'Beak direction': BeakDirection | null
    'Swift Start': string | null
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
    CardType: CardType
    recordings?: string[]
}

export enum CardType {
    Bird = 'Bird',
    Hummingbird = 'Hummingbird',
    Bonus = 'Bonus',
}

export function isBirdCard(object: any): object is BirdCard {
    return object?.CardType === CardType.Bird
}

export function isHummingbirdCard(object: any): object is BirdCard {
    return object?.CardType === CardType.Hummingbird
}

export function isBirdOrHummingbirdCard(object: any): object is BirdCard {
    return isBirdCard(object) || isHummingbirdCard(object)
}

export enum Color {
    Brown = 'brown',
    Pink = 'pink',
    Teal = 'teal',
    White = 'white',
    Yellow = 'yellow',
}

export enum NestType {
    Bowl = 'bowl',
    Cavity = 'cavity',
    Ground = 'ground',
    None = 'none',
    Platform = 'platform',
    Wild = 'wild',
}

export enum BeakDirection {
    Left = 'L',
    LeftLeft = 'LL',
    LeftRight = 'LR',
    Neither = 'N',
    Right = 'R',
}

export const LeftBeakDirections = [
    BeakDirection.Left,
    BeakDirection.LeftLeft,
    BeakDirection.LeftRight
];

export const RightBeakDirections = [
    BeakDirection.LeftRight,
    BeakDirection.Right
]

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
    'Bonus card': string
    Set: ExpansionType
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
    CardType: CardType
}

export function isBonusCard(object: any): object is BonusCard {
    return object?.CardType === CardType.Bonus
}

export enum ExpansionType {
    Core = 'core',
    European = 'european',
    Oceania = 'oceania',
    Asia = 'asia',
    Americas = 'americas'
}

export enum PackType {
    promoAsia = 'promoAsia',
    promoCA = 'promoCA',
    promoEurope = 'promoEurope',
    promoNZ = 'promoNZ',
    promoUS = 'promoUS',
    promoUK = 'promoUK'
}

export interface Expansion {
    core: boolean,
    european: boolean,
    oceania: boolean,
    asia: boolean,
    americas: boolean
}

export interface PromoPack {
    promoAsia: boolean,
    promoCA: boolean,
    promoEurope: boolean,
    promoNZ: boolean,
    promoUS: boolean,
    promoUK: boolean
}

export interface DisplayedStats {
    birdCards: number
    hummingbirdCards: number
    bonusCards: number
    habitat: {
        forest: number
        grassland: number
        wetland: number
    }
}

export enum GroupType {
    Bee = 'bees & mountaingems',
    Brilliant = 'brilliants & coquettes',
    Emerald = 'emeralds',
    Mango = 'mangoes',
    Topaz = 'topazes, jacobins, & hermits'
}
export enum BenefitType {
    Card = 'card',
    Nectar = 'nectar',
    Egg = 'egg',
    Row = 'row',
    Advance = 'advance'
}