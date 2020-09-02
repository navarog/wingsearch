import { createAction, props } from '@ngrx/store'

export const search = createAction('[App] Search', props<{main: string, bonus: string}>())

export const bonusCardSearch = createAction('[App] Bonus Card Search', props<{bonus: string}>())
