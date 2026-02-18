import { createAction, props } from '@ngrx/store'
import { Expansion, PromoPack } from './app.interfaces'

export const search = createAction('[App] Search', props<{
    main: string,
    bonus: number[],
    stats: {
        habitat: {
            forest: number,
            grassland: number,
            wetland: number
        },
        birds: boolean,
        bonuses: boolean,
        hummingbirds: boolean
    },
    expansion: Expansion,
    promoPack: PromoPack,
    eggs: {
        min: number,
        max: number
    },
    points: {
        min: number,
        max: number
    },
    wingspan: {
        min: number,
        max: number
    }
    foodCost: {
        min: number,
        max: number
    }
    colors: {
        brown: boolean,
        pink: boolean,
        white: boolean,
        teal: boolean,
        yellow: boolean
    },
    food: {
        invertebrate: number,
        seed: number,
        fruit: number,
        fish: number,
        rodent: number,
        nectar: number,
        'wild (food)': number,
        'no-food': number
    },
    nest: {
        bowl: boolean,
        cavity: boolean,
        ground: boolean,
        none: boolean,
        platform: boolean,
        wild: boolean
    },
    beak: {
      left: boolean,
      right: boolean
    }
}>()
)

export const bonusCardSearch = createAction('[App] Bonus Card Search',
    props<{
        bonus: string[], bonusfield: string, expansion: Expansion
    }>()
)

export const scroll = createAction('[App] Scroll')

export const setLanguage = createAction('[App] Set language',
    props<{
        payload: {
            birds: { 'Common name': string, 'Power text': string, 'Note': string }[],
            bonuses: { 'Bonus card': string, 'Condition': string, 'Explanatory text': string, 'VP': string, 'Note': string },
            other: { [key: string]: { Translated: string } }
            parameters: { [key: string]: {Value: unknown} }
        },
        language: string,
        expansion: Expansion
    }>())

export const changeLanguage = createAction('[App] Change language',
    props<{
        language: string,
        expansion: Expansion,
        promoPack: PromoPack
  }>()
)

export const resetLanguage = createAction('[App] Reset language',
    props<{
        expansion: Expansion
  }>()
)

export const changeAssetPack = createAction('[App] Change asset pack',
    props<{
        assetPack: string
  }>()
)

// Playlist actions
export const addToPlaylist = createAction('[Playlist] Add to playlist',
    props<{ birdId: number }>()
)

export const addToPlaylistAndPlay = createAction('[Playlist] Add to playlist and play',
    props<{ birdId: number }>()
)

export const removeFromPlaylist = createAction('[Playlist] Remove from playlist',
    props<{ birdId: number }>()
)

export const clearPlaylist = createAction('[Playlist] Clear playlist')

export const startPlaylist = createAction('[Playlist] Start playlist')

export const pausePlaylist = createAction('[Playlist] Pause playlist')

export const resumePlaylist = createAction('[Playlist] Resume playlist')

export const stopPlaylist = createAction('[Playlist] Stop playlist')

export const nextSong = createAction('[Playlist] Next song')

export const toggleShuffle = createAction('[Playlist] Toggle shuffle')


export const playlistSongEnded = createAction('[Playlist] Song ended')

export const setPlaylistVolume = createAction('[Playlist] Set volume',
    props<{ volume: number }>()
)
