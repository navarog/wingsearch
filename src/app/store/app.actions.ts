import { createAction, props } from '@ngrx/store'

export const search = createAction('[App] Search', props<{main: string}>())
