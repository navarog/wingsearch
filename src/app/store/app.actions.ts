import { createAction, props } from '@ngrx/store'

export const search = createAction('[App] Search',
    props<{ main: string, bonus: string, habitat: { forest: boolean, grassland: boolean, wetland: boolean } }>()
)

export const bonusCardSearch = createAction('[App] Bonus Card Search', props<{ bonus: string }>())
