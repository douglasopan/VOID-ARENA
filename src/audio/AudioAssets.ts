import type { MapSize, PowerUpType, WorldObjectKind } from '../shared/types';

const CITY_MAP_MUSIC_ASSETS = [
  '/audio/music/citymap1.ogg',
  '/audio/music/citymap2.ogg',
  '/audio/music/concrete_symphony.ogg'
];

export const MENU_MUSIC_ASSETS = [
  '/audio/music/mainmenu1.ogg',
  '/audio/music/mainmenu2.ogg'
];

export const CITY_AMBIENCE_ASSETS = [
  '/audio/ambient/city_background_loop.ogg',
  '/audio/ambient/city_background_loop_1.ogg'
];

export const MAP_MUSIC_ASSETS: Record<MapSize, string[]> = {
  small: CITY_MAP_MUSIC_ASSETS,
  medium: CITY_MAP_MUSIC_ASSETS,
  large: CITY_MAP_MUSIC_ASSETS,
  huge: CITY_MAP_MUSIC_ASSETS
};

export const OBJECT_SWALLOW_SFX_ASSETS: Partial<Record<WorldObjectKind, string | string[]>> = {
  tree: '/audio/sfx/tree_fall.ogg',
  planter: '/audio/sfx/tree_fall.ogg',
  car: [
    '/audio/sfx/car_crash_fall.ogg',
    '/audio/sfx/car_horn_away_1.ogg',
    '/audio/sfx/car_horn_away_2.ogg'
  ],
  truck: [
    '/audio/sfx/car_crash_fall.ogg',
    '/audio/sfx/car_horn_away_1.ogg',
    '/audio/sfx/car_horn_away_2.ogg'
  ],
  pedestrian: [
    '/audio/sfx/person_fall_man_no_1.ogg',
    '/audio/sfx/person_fall_man_no_2.ogg',
    '/audio/sfx/person_fall_woman_no_1.ogg',
    '/audio/sfx/person_fall_woman_no_2.ogg'
  ]
};

export const POWERUP_SFX_ASSETS: Partial<Record<PowerUpType, string>> = {};

export const HOLE_SWALLOW_SFX_ASSET: string | null = null;

export const BUTTON_HOVER_SFX_ASSET = '/audio/ui/hover_button.ogg';

export const BUTTON_CLICK_SFX_ASSET = '/audio/ui/click_button.ogg';

export const PLAYER_DIE_SFX_ASSET = '/audio/sfx/die_sound.ogg';
