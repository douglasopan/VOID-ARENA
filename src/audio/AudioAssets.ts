import type { MapSize, PowerUpType, WorldObjectKind } from '../shared/types';

const CITY_MAP_MUSIC_ASSETS = [
  '/audio/music/citymap1.mp3',
  '/audio/music/citymap2.mp3',
  '/audio/music/concrete_symphony.mp3'
];

export const MENU_MUSIC_ASSETS = [
  '/audio/music/mainmenu1.mp3',
  '/audio/music/mainmenu2.mp3'
];

export const MAP_MUSIC_ASSETS: Record<MapSize, string[]> = {
  small: CITY_MAP_MUSIC_ASSETS,
  medium: CITY_MAP_MUSIC_ASSETS,
  large: CITY_MAP_MUSIC_ASSETS,
  huge: CITY_MAP_MUSIC_ASSETS
};

export const OBJECT_SWALLOW_SFX_ASSETS: Partial<Record<WorldObjectKind, string | string[]>> = {
  tree: '/audio/sfx/tree_fall.mp3',
  planter: '/audio/sfx/tree_fall.mp3',
  car: [
    '/audio/sfx/car_crash_fall.mp3',
    '/audio/sfx/car_horn_away_1.mp3',
    '/audio/sfx/car_horn_away_2.mp3'
  ],
  truck: [
    '/audio/sfx/car_crash_fall.mp3',
    '/audio/sfx/car_horn_away_1.mp3',
    '/audio/sfx/car_horn_away_2.mp3'
  ],
  pedestrian: '/audio/sfx/man_fall.mp3'
};

export const POWERUP_SFX_ASSETS: Partial<Record<PowerUpType, string>> = {};

export const HOLE_SWALLOW_SFX_ASSET: string | null = null;

export const BUTTON_HOVER_SFX_ASSET = '/audio/ui/hover_button.mp3';

export const BUTTON_CLICK_SFX_ASSET = '/audio/ui/click_button.mp3';

export const PLAYER_DIE_SFX_ASSET = '/audio/sfx/die_sound.mp3';
