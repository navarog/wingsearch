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
    }
}>()
)

export const bonusCardSearch = createAction('[App] Bonus Card Search',
    props<{ bonus: string[], bonusfield: string, expansion: { european: boolean } }>()
)

export const scroll = createAction('[App] Scroll')
