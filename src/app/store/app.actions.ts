import { createAction, props } from '@ngrx/store'

export const search = createAction('[App] Search', props<{
    main: string,
    bonus: string[],
    stats: {
        habitat: {
            forest: boolean,
            grassland: boolean,
            wetland: boolean
        },
        birds: boolean,
        bonuses: boolean
    },
    expansion: {
        european: boolean
    },
    eggs: {
        min: number,
        max: number
    },
    points: {
        min: number,
        max: number
    },
    colors: {
        brown: boolean,
        pink: boolean,
        white: boolean,
        teal: boolean
    },
    food: {
        invertebrate: boolean,
        seed: boolean,
        fruit: boolean,
        fish: boolean,
        rodent: boolean,
        'wild (food)': boolean,
        'no-food': boolean
    },
    nest: {
        Bowl: boolean,
        Cavity: boolean,
        Ground: boolean,
        None: boolean,
        Platform: boolean,
        Wild: boolean
    }
}>()
)

export const bonusCardSearch = createAction('[App] Bonus Card Search',
    props<{ bonus: string[], bonusfield: string, expansion: { european: boolean } }>()
)

export const scroll = createAction('[App] Scroll')

// TODO proper typing
export const setLanguage = createAction('[App] Set language',
    props<{ payload: {birds: object, bonuses: object, other: object} }>())
