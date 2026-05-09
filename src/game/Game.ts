import * as THREE from 'three';
import { AudioManager } from '../audio/AudioManager';
import { getEngineConfig, saveEngineConfig, subscribeEngineConfig, type EngineConfig, type EngineControlsConfig } from '../admin/EngineConfig';
import { detectLanguage, powerUpLabelKey, t, tf, type TranslationKey } from '../i18n/I18n';
import { BOT_NAMES, CAMERA_ZOOM_MAX, CAMERA_ZOOM_MIN, MAGNET_PULL_STRENGTH, RIM_COLORS } from '../shared/constants';
import type { ChatMessage, DayNightMode, GraphicsQuality, HoleRimStyle, LanguageCode, MatchResult, MockRoomSummary, PlayerAudioPreferences } from '../shared/types';
import { InputManager } from '../input/InputManager';
import { NetworkClient } from '../network/NetworkClient';
import { PlayerProfileStore } from '../player/PlayerProfileStore';
import { SceneManager } from '../render/SceneManager';
import { ChatUI } from '../ui/ChatUI';
import { EndScreen } from '../ui/EndScreen';
import { AdminEnginePanel } from '../ui/AdminEnginePanel';
import { FindGamesMenu } from '../ui/FindGamesMenu';
import { HostMenu } from '../ui/HostMenu';
import { HUD, type HudDisasterWarning, type HudObjectiveStatus } from '../ui/HUD';
import { MainMenu } from '../ui/MainMenu';
import { MatchSetupMenu } from '../ui/MatchSetupMenu';
import { PauseMenu } from '../ui/PauseMenu';
import { SoloPresetMenu, type SoloPreset } from '../ui/SoloPresetMenu';
import { BotController } from './BotController';
import { BotManager } from './BotManager';
import { BOT_DIFFICULTY_PROFILES, getBotDifficultyForIndex } from './BotDifficulty';
import { canObjectFit } from './BalanceConfig';
import type { MatchConfig } from './MatchConfig';
import { createDefaultMatchConfig, generateMapSeed, normalizeMapSeed } from './MatchConfig';
import { MatchMode } from './MatchMode';
import { MatchTimer } from './MatchTimer';
import {
  CLEAR_NATURAL_DISASTER,
  NaturalDisasterSystem,
  type NaturalDisasterSnapshot,
  type NaturalDisasterType
} from './NaturalDisasterSystem';
import type { Player } from './Player';
import { PlayerManager } from './PlayerManager';
import { ProceduralMapGenerator } from './ProceduralMapGenerator';
import { RespawnSystem } from './RespawnSystem';
import { SwallowSystem, type SwallowEvent } from './SwallowSystem';
import { World } from './World';
import type { WorldObject } from './WorldObject';
import type { RoomCreateOptions, ServerPlayerState, ServerRoomSummary } from '../../server/shared/serverTypes';

type GameState = 'booting' | 'menu' | 'setup' | 'playing' | 'paused' | 'ended';

export class Game {
  private shell!: HTMLDivElement;
  private sceneLayer!: HTMLDivElement;
  private uiLayer!: HTMLDivElement;
  private deathNotice!: HTMLDivElement;
  private killNotice!: HTMLDivElement;
  private deathFade!: HTMLDivElement;
  private sceneManager!: SceneManager;
  private inputManager!: InputManager;
  private readonly audioManager = new AudioManager();
  private readonly profileStore = new PlayerProfileStore();
  private readonly mapGenerator = new ProceduralMapGenerator();
  private readonly naturalDisasterSystem = new NaturalDisasterSystem();
  private readonly networkClient = new NetworkClient();
  private readonly playerManager = new PlayerManager();
  private readonly botManager = new BotManager();
  private mainMenu!: MainMenu;
  private matchSetupMenu!: MatchSetupMenu;
  private findGamesMenu!: FindGamesMenu;
  private hostMenu!: HostMenu;
  private soloPresetMenu!: SoloPresetMenu;
  private pauseMenu!: PauseMenu;
  private chatUI!: ChatUI;
  private hud!: HUD;
  private endScreen!: EndScreen;
  private adminEnginePanel!: AdminEnginePanel;
  private world: World | null = null;
  private menuWorld: World | null = null;
  private menuPreviewElapsed = 0;
  private swallowSystem: SwallowSystem | null = null;
  private respawnSystem: RespawnSystem | null = null;
  private timer: MatchTimer | null = null;
  private state: GameState = 'booting';
  private lastFrame = performance.now();
  private animationId = 0;
  private playerName = '';
  private currentConfig: MatchConfig | null = null;
  private lastConfig: MatchConfig | null = null;
  private chatEnabled = true;
  private cameraZoom = 1;
  private deathCameraEnabled = true;
  private musicEnabled = true;
  private holeRimColor = RIM_COLORS[0];
  private holeRimStyle: HoleRimStyle = 'neon';
  private language: LanguageCode = detectLanguage();
  private deathCameraTargetId: string | null = null;
  private deathCameraElapsed = 0;
  private messageId = 1;
  private readonly sizeAnnouncements = new Map<string, number>();
  private networkHooksBound = false;
  private networkSendAccumulator = 0;
  private readonly appliedNetworkSwallows = new Set<string>();
  private deathNoticeTimer = 0;
  private killNoticeTimer = 0;
  private localHoleCombo = 0;
  private lastLocalHoleKillAt = 0;
  private currentDisasterSnapshot: NaturalDisasterSnapshot = CLEAR_NATURAL_DISASTER;
  private performanceSampleElapsed = 0;
  private performanceSampleFrames = 0;
  private performanceSlowFrames = 0;
  private performanceDegradeCooldown = 0;
  private adminPanelWasPlaying = false;
  private unsubscribeEngineConfig: (() => void) | null = null;
  private objectiveProgress = 0;
  private objectiveCompleted = false;
  private objectiveFailed = false;
  private localDashCooldown = 0;
  private localDashRemaining = 0;
  private localDashSpeed = 0;
  private readonly localDashDirection = new THREE.Vector3();
  private localPowerCooldown = 0;
  private readonly lastAimDirection = new THREE.Vector3(0, 0, -1);

  constructor(private readonly root: HTMLElement) {}

  boot(): void {
    this.root.innerHTML = '';
    this.shell = document.createElement('div');
    this.shell.className = 'game-shell';
    this.sceneLayer = document.createElement('div');
    this.sceneLayer.className = 'scene-layer';
    this.uiLayer = document.createElement('div');
    this.uiLayer.className = 'ui-layer';
    this.deathNotice = document.createElement('div');
    this.deathNotice.className = 'death-notice hidden';
    this.killNotice = document.createElement('div');
    this.killNotice.className = 'kill-notice hidden';
    this.deathFade = document.createElement('div');
    this.deathFade.className = 'death-fade';
    this.uiLayer.append(this.deathFade, this.deathNotice, this.killNotice);
    this.shell.append(this.sceneLayer, this.uiLayer);
    this.root.appendChild(this.shell);
    this.bindUiButtonSounds();
    this.bindCameraZoomControls();
    this.bindAudioUnlock();

    this.sceneManager = new SceneManager(this.sceneLayer);
    this.inputManager = new InputManager({
      onEscape: () => this.handleEscape(),
      onEnter: () => this.handleEnter(),
      onPause: () => this.handleEscape()
    }, this.uiLayer);
    this.inputManager.bindPointerMoveRoot(this.sceneManager.renderer.domElement);
    this.inputManager.setTouchControlsVisible(false);
    this.mainMenu = new MainMenu(this.uiLayer);
    this.matchSetupMenu = new MatchSetupMenu(this.uiLayer);
    this.findGamesMenu = new FindGamesMenu(this.uiLayer);
    this.hostMenu = new HostMenu(this.uiLayer);
    this.soloPresetMenu = new SoloPresetMenu(this.uiLayer);
    this.pauseMenu = new PauseMenu(this.uiLayer, this.audioManager);
    this.chatUI = new ChatUI(this.uiLayer);
    this.hud = new HUD(this.uiLayer);
    this.endScreen = new EndScreen(this.uiLayer);
    this.adminEnginePanel = new AdminEnginePanel(this.uiLayer, this.audioManager);
    window.addEventListener('keydown', this.handleAdminHotkey);
    this.unsubscribeEngineConfig = subscribeEngineConfig((config) => this.applyEngineConfigRuntime(config));
    this.applyEngineConfigRuntime(getEngineConfig());
    if (window.location.hash === '#admin-engine') {
      window.setTimeout(() => this.showAdminEnginePanel(), 0);
    }

    this.showMainMenu();
    this.lastFrame = performance.now();
    this.animationId = window.requestAnimationFrame(this.loop);
  }

  private readonly loop = (timestamp: number): void => {
    if (document.hidden) {
      this.lastFrame = timestamp;
      this.animationId = window.requestAnimationFrame(this.loop);
      return;
    }

    const rawDeltaMs = Math.max(0, timestamp - this.lastFrame);
    const deltaSeconds = Math.min(0.05, rawDeltaMs / 1000);
    this.lastFrame = timestamp;

    if (this.state === 'playing') {
      this.updateMatch(deltaSeconds);
      const deathCameraTarget =
        this.world && this.deathCameraEnabled && this.deathCameraTargetId
          ? this.playerManager.get(this.deathCameraTargetId)
          : undefined;
      if (this.world && deathCameraTarget) {
        this.deathCameraElapsed += deltaSeconds;
        this.sceneManager.updateDeathDive(
          this.world,
          this.playerManager,
          deathCameraTarget,
          deltaSeconds,
          this.deathCameraElapsed,
          this.currentDisasterSnapshot
        );
        this.updateDeathFade();
      } else {
        this.setDeathFade(0);
        this.sceneManager.update(
          this.world,
          this.playerManager,
          this.playerManager.getLocalPlayer(),
          deltaSeconds,
          this.cameraZoom,
          this.currentDisasterSnapshot
        );
      }
    } else if (this.state === 'menu' && this.menuWorld) {
      this.menuPreviewElapsed += deltaSeconds;
      this.menuWorld.updateDynamicObjects(deltaSeconds);
      this.sceneManager.updateMenuPreview(this.menuWorld, deltaSeconds, this.menuPreviewElapsed);
    } else {
      this.sceneManager.update(
        this.world,
        this.playerManager,
        this.playerManager.getLocalPlayer(),
        deltaSeconds,
        this.cameraZoom,
        this.currentDisasterSnapshot
      );
    }
    this.sceneManager.render();
    this.updateAdaptivePerformance(rawDeltaMs);
    this.animationId = window.requestAnimationFrame(this.loop);
  };

  private updateAdaptivePerformance(rawDeltaMs: number): void {
    if (rawDeltaMs <= 0) {
      return;
    }

    this.performanceDegradeCooldown = Math.max(0, this.performanceDegradeCooldown - rawDeltaMs / 1000);
    this.performanceSampleElapsed += rawDeltaMs;
    this.performanceSampleFrames += 1;
    if (rawDeltaMs > 33.5) {
      this.performanceSlowFrames += 1;
    }

    if (this.performanceSampleElapsed < 2400 || this.performanceSampleFrames < 90) {
      return;
    }

    const averageFrameMs = this.performanceSampleElapsed / this.performanceSampleFrames;
    const slowFrameRatio = this.performanceSlowFrames / this.performanceSampleFrames;
    if (this.performanceDegradeCooldown <= 0 && (averageFrameMs > 24.5 || slowFrameRatio > 0.18)) {
      if (this.sceneManager.reduceRenderingCost()) {
        this.performanceDegradeCooldown = 8;
      }
    }

    this.performanceSampleElapsed = 0;
    this.performanceSampleFrames = 0;
    this.performanceSlowFrames = 0;
  }

  private showMainMenu(): void {
    this.state = 'menu';
    this.clearMatch();
    this.loadMenuPreview();
    this.hideMenus();
    this.hud.hide();
    this.chatUI.hide();
    const profile = this.profileStore.load();
    if (profile) {
      this.applyProfileAudioPreferences(profile);
    }
    this.startMenuMusicIfEnabled();
    if (!this.playerName && profile?.playerName) {
      this.playerName = profile.playerName;
    }
    if (profile) {
      this.holeRimColor = profile.holeRimColor || RIM_COLORS[0];
      this.holeRimStyle = profile.holeRimStyle || 'neon';
      this.language = profile.language || this.language;
    }
    this.mainMenu.show(
      {
        onStartSolo: (name) => this.showSoloPresets(this.activateProfile(name)),
        onFindGames: (name) => void this.showFindGames(this.activateProfile(name)),
        onHostMatch: (name) => this.showHostMatch(this.activateProfile(name)),
        onSettings: () => this.showSettingsOverlay(false),
        onLanguageChange: (language, playerName) => {
          this.applyLanguage(language, playerName);
          this.showMainMenu();
        }
      },
      this.playerName,
      profile,
      this.language
    );
  }

  private showSoloPresets(playerName: string): void {
    this.playerName = playerName;
    this.state = 'setup';
    this.startMenuMusicIfEnabled();
    this.hideMenus();
    this.soloPresetMenu.show({
      onPreset: (preset, dayNightMode, mapSeed) => this.startMatch(this.createSoloPresetConfig(playerName, preset, dayNightMode, mapSeed)),
      onCustom: (mapSeed) => this.showCustomSoloSetup(playerName, mapSeed),
      onBack: () => this.showMainMenu()
    }, this.language);
  }

  private showCustomSoloSetup(playerName: string, mapSeed = generateMapSeed()): void {
    this.playerName = playerName;
    this.state = 'setup';
    this.startMenuMusicIfEnabled();
    this.hideMenus();
    this.matchSetupMenu.show(playerName, {
      onStart: (config) => this.startMatch(config),
      onBack: () => this.showSoloPresets(playerName)
    }, {
      singlePlayerMode: 'custom',
      cameraZoom: this.cameraZoom,
      deathCameraEnabled: this.deathCameraEnabled,
      holeRimColor: this.holeRimColor,
      holeRimStyle: this.holeRimStyle,
      mapSeed
    }, this.language);
  }

  private createSoloPresetConfig(playerName: string, preset: SoloPreset, dayNightMode: DayNightMode = 'cycle', mapSeed = generateMapSeed()): MatchConfig {
    const config = {
      ...createDefaultMatchConfig(playerName),
      holeRimColor: this.holeRimColor,
      holeRimStyle: this.holeRimStyle,
      cameraZoom: this.cameraZoom,
      deathCameraEnabled: this.deathCameraEnabled,
      dayNightMode,
      mapSeed
    };

    switch (preset) {
      case 'easy':
        return {
          ...config,
          singlePlayerMode: 'quick',
          mapSize: 'small',
          durationSeconds: 120,
          botCount: 5,
          botDifficultyMix: 'relaxed',
          objectDensityMultiplier: 0.96,
          powerUpCount: 18,
          respawnSafeRadius: 14
        };
      case 'hard':
        return {
          ...config,
          singlePlayerMode: 'quick',
          mapSize: 'large',
          durationSeconds: 300,
          botCount: 35,
          botDifficultyMix: 'competitive',
          objectDensityMultiplier: 1.08,
          powerUpCount: 72,
          respawnSafeRadius: 10
        };
      case 'timeTrial':
        return {
          ...config,
          singlePlayerMode: 'time-trial',
          matchMode: MatchMode.TimeTrial,
          mapSize: 'medium',
          durationSeconds: 180,
          botCount: 0,
          objectDensityMultiplier: 1.04,
          powerUpCount: 24,
          respawnSafeRadius: 16,
          itemRespawnEnabled: false,
          powerUpRespawnEnabled: false,
          objective: {
            type: 'swallowCategory',
            targetCategory: 'building',
            targetCount: 12,
            title: t(this.language, 'objectiveTimeTrialBuildingsTitle'),
            description: t(this.language, 'objectiveTimeTrialBuildingsDesc')
          }
        };
      case 'careerBuildings':
        return this.createCareerStageConfig(config, 'career-buildings', {
          mapSize: 'small',
          durationSeconds: 150,
          botCount: 4,
          botDifficultyMix: 'relaxed',
          objective: {
            type: 'swallowCategory',
            targetCategory: 'building',
            targetCount: 8,
            title: t(this.language, 'objectiveCareerBuildingsTitle'),
            description: t(this.language, 'objectiveCareerBuildingsDesc')
          }
        });
      case 'careerCollector':
        return this.createCareerStageConfig(config, 'career-collector', {
          mapSize: 'medium',
          durationSeconds: 210,
          botCount: 8,
          botDifficultyMix: 'balanced',
          objective: {
            type: 'swallowKind',
            targetKind: 'car',
            targetCount: 10,
            title: t(this.language, 'objectiveCareerCollectorTitle'),
            description: t(this.language, 'objectiveCareerCollectorDesc')
          }
        });
      case 'careerHunter':
        return this.createCareerStageConfig(config, 'career-hunter', {
          mapSize: 'large',
          durationSeconds: 240,
          botCount: 18,
          botDifficultyMix: 'competitive',
          objective: {
            type: 'eliminateHoles',
            targetCount: 3,
            title: t(this.language, 'objectiveCareerHunterTitle'),
            description: t(this.language, 'objectiveCareerHunterDesc')
          }
        });
      case 'careerScore':
        return this.createCareerStageConfig(config, 'career-score', {
          mapSize: 'huge',
          durationSeconds: 300,
          botCount: 16,
          botDifficultyMix: 'balanced',
          objective: {
            type: 'score',
            targetCount: 2800,
            title: t(this.language, 'objectiveCareerScoreTitle'),
            description: t(this.language, 'objectiveCareerScoreDesc')
          }
        });
      case 'creative':
        return {
          ...config,
          singlePlayerMode: 'creative',
          matchMode: MatchMode.Creative,
          mapSize: 'large',
          durationSeconds: 0,
          botCount: 0,
          objectDensityMultiplier: 1.15,
          powerUpCount: 72,
          respawnSafeRadius: 20,
          itemRespawnEnabled: true,
          powerUpRespawnEnabled: true
        };
      case 'medium':
      default:
        return {
          ...config,
          singlePlayerMode: 'quick',
          mapSize: 'medium',
          durationSeconds: 180,
          botCount: 14,
          botDifficultyMix: 'balanced',
          objectDensityMultiplier: 1,
          powerUpCount: 36,
          respawnSafeRadius: 12
        };
    }
  }

  private createCareerStageConfig(
    baseConfig: MatchConfig,
    stageId: string,
    options: Partial<MatchConfig> & { objective: NonNullable<MatchConfig['objective']> }
  ): MatchConfig {
    return {
      ...baseConfig,
      ...options,
      singlePlayerMode: 'career',
      matchMode: MatchMode.Career,
      careerStageId: stageId,
      objectDensityMultiplier: options.objectDensityMultiplier ?? 1.08,
      powerUpCount: options.powerUpCount ?? 34,
      respawnSafeRadius: options.respawnSafeRadius ?? 14,
      itemRespawnEnabled: false,
      powerUpRespawnEnabled: true
    };
  }

  private prepareMatchConfig(config: MatchConfig): MatchConfig {
    const prepared: MatchConfig = {
      ...config,
      botCount: Math.min(100, Math.max(0, config.botCount)),
      itemRespawnEnabled: config.itemRespawnEnabled ?? true,
      powerUpRespawnEnabled: config.powerUpRespawnEnabled ?? true
    };
    prepared.mapSeed = normalizeMapSeed(prepared.mapSeed) || generateMapSeed();

    if (prepared.matchMode === MatchMode.TimeTrial) {
      prepared.singlePlayerMode = 'time-trial';
      prepared.itemRespawnEnabled = false;
      prepared.powerUpRespawnEnabled = false;
      prepared.objective ??= {
        type: 'swallowCategory',
        targetCategory: 'building',
        targetCount: 12,
        title: t(this.language, 'objectiveTimeTrialBuildingsTitle'),
        description: t(this.language, 'objectiveTimeTrialBuildingsDesc')
      };
      prepared.durationSeconds = Math.max(30, prepared.durationSeconds || 180);
    }

    if (prepared.matchMode === MatchMode.Career) {
      prepared.singlePlayerMode = 'career';
      prepared.itemRespawnEnabled = false;
      prepared.durationSeconds = Math.max(30, prepared.durationSeconds || 180);
    }

    if (prepared.matchMode === MatchMode.Creative) {
      prepared.singlePlayerMode = 'creative';
      prepared.durationSeconds = 0;
      prepared.objective = undefined;
    }

    return prepared;
  }

  private shouldUseMatchTimer(config: MatchConfig): boolean {
    return (
      config.durationSeconds > 0 &&
      (config.matchMode === MatchMode.Timed ||
        config.matchMode === MatchMode.TimeTrial ||
        config.matchMode === MatchMode.Career)
    );
  }

  private async showFindGames(playerName: string): Promise<void> {
    this.playerName = playerName;
    this.state = 'setup';
    this.startMenuMusicIfEnabled();
    this.hideMenus();
    let rooms: Array<ServerRoomSummary | MockRoomSummary>;
    try {
      await this.networkClient.connect();
      this.bindNetworkHooks();
      rooms = await this.networkClient.listRooms();
    } catch {
      rooms = this.createMockRooms();
    }
    this.findGamesMenu.show(rooms, {
      onJoin: (room) => {
        if ('seed' in room) {
          void this.joinMultiplayerRoom(room, playerName);
          return;
        }
        const config = createDefaultMatchConfig(playerName);
        config.mapSize = room.mapSize;
        config.matchMode = room.matchMode;
        config.botCount = room.botsEnabled ? Math.max(0, room.maxPlayers - room.players - 1) + 6 : 0;
        config.maxPlayers = room.maxPlayers;
        config.roomName = room.roomName;
        config.fillBots = room.botsEnabled;
        config.holeRimColor = this.holeRimColor;
        config.holeRimStyle = this.holeRimStyle;
        this.startMatch(config);
      },
      onBack: () => this.showMainMenu()
    }, this.language);
  }

  private showHostMatch(playerName: string): void {
    this.playerName = playerName;
    this.state = 'setup';
    this.startMenuMusicIfEnabled();
    this.hideMenus();
    this.hostMenu.show(playerName, {
      onHost: (config) => void this.hostMultiplayerMatch(config),
      onBack: () => this.showMainMenu()
    }, {
      cameraZoom: this.cameraZoom,
      deathCameraEnabled: this.deathCameraEnabled,
      holeRimColor: this.holeRimColor,
      holeRimStyle: this.holeRimStyle
    }, this.language);
  }

  private async hostMultiplayerMatch(config: MatchConfig): Promise<void> {
    try {
      await this.networkClient.connect();
      this.bindNetworkHooks();
      const roomOptions: RoomCreateOptions = {
        roomName: config.roomName || `${config.playerName}'s Arena`,
        maxPlayers: config.maxPlayers ?? 16,
        fillBots: Boolean(config.fillBots),
        mapSize: config.mapSize,
        matchMode: config.matchMode,
        durationSeconds: config.durationSeconds,
        enableChat: config.enableChat,
        enableAds: config.enableAds,
        dayNightMode: config.dayNightMode,
        objectDensityMultiplier: config.objectDensityMultiplier,
        powerUpCount: config.powerUpCount,
        respawnSafeRadius: config.respawnSafeRadius,
        itemRespawnEnabled: config.itemRespawnEnabled,
        powerUpRespawnEnabled: config.powerUpRespawnEnabled,
        botDifficultyMix: config.botDifficultyMix,
        mapSeed: normalizeMapSeed(config.mapSeed) || generateMapSeed()
      };
      const room = await this.networkClient.createRoom(roomOptions);
      await this.joinMultiplayerRoom(room, config.playerName, config);
    } catch (error) {
      console.error(error);
      const serverUrl = window.prompt(
        tf(this.language, 'serverUnavailablePrompt', { url: this.networkClient.serverUrl }),
        this.networkClient.serverUrl === window.location.origin ? '' : this.networkClient.serverUrl
      );
      if (serverUrl?.trim()) {
        this.networkClient.setServerUrl(serverUrl);
        await this.hostMultiplayerMatch(config);
      }
    }
  }

  private async joinMultiplayerRoom(
    room: ServerRoomSummary,
    playerName: string,
    baseConfig: MatchConfig = {
      ...createDefaultMatchConfig(playerName),
      holeRimColor: this.holeRimColor,
      holeRimStyle: this.holeRimStyle
    }
  ): Promise<void> {
    try {
      await this.networkClient.connect();
      this.bindNetworkHooks();
      const joined = await this.networkClient.joinRoom(room.id, playerName);
      if (!joined.ok) {
        window.alert(joined.reason || t(this.language, 'couldNotJoinRoom'));
        return;
      }

      const config: MatchConfig = {
        ...baseConfig,
        playerName,
        mapSize: room.mapSize,
        matchMode: room.matchMode,
        durationSeconds: room.durationSeconds,
        enableAds: room.enableAds,
        enableChat: room.enableChat,
        dayNightMode: room.dayNightMode ?? 'cycle',
        multiplayer: true,
        roomId: room.id,
        roomName: room.roomName,
        mapSeed: room.seed,
        objectDensityMultiplier: room.objectDensityMultiplier,
        powerUpCount: room.powerUpCount,
        respawnSafeRadius: room.respawnSafeRadius,
        itemRespawnEnabled: room.itemRespawnEnabled ?? true,
        powerUpRespawnEnabled: room.powerUpRespawnEnabled ?? true,
        botDifficultyMix: room.botDifficultyMix,
        botCount: 0,
        fillBots: room.botsEnabled,
        maxPlayers: room.maxPlayers
      };
      this.startMatch(config);
    } catch (error) {
      console.error(error);
      window.alert(t(this.language, 'couldNotJoinRoom'));
    }
  }

  private startMatch(config: MatchConfig): void {
    const preparedConfig = this.prepareMatchConfig(config);
    this.hideMenus();
    this.endScreen.hide();
    this.clearMatch();
    this.currentConfig = preparedConfig;
    this.lastConfig = { ...preparedConfig };
    this.objectiveProgress = 0;
    this.objectiveCompleted = false;
    this.objectiveFailed = false;
    this.playerName = preparedConfig.playerName;
    this.chatEnabled = preparedConfig.enableChat;
    this.cameraZoom = preparedConfig.cameraZoom;
    this.deathCameraEnabled = preparedConfig.deathCameraEnabled;
    this.holeRimColor = preparedConfig.holeRimColor;
    this.holeRimStyle = preparedConfig.holeRimStyle;
    this.clearDeathCamera();
    this.sizeAnnouncements.clear();
    this.naturalDisasterSystem.reset();
    this.currentDisasterSnapshot = CLEAR_NATURAL_DISASTER;

    const mapData = this.mapGenerator.generate({
      size: preparedConfig.mapSize,
      enableAds: preparedConfig.enableAds,
      seed: preparedConfig.mapSeed,
      objectDensityMultiplier: this.effectiveObjectDensityMultiplier(preparedConfig),
      powerUpCount: preparedConfig.powerUpCount
    });
    this.world = new World(mapData);
    this.delayInitialPowerUps(20);
    this.sceneManager.setGraphicsQuality(preparedConfig.graphicsQuality);
    const localSpawn = this.world.getSpawnPoint(0);
    const localId = preparedConfig.multiplayer && this.networkClient.socketId ? this.networkClient.socketId : 'local-player';
    const spawnProtectionNow = performance.now() / 1000;
    this.playerManager.createLocalPlayer(this.currentConfig.playerName, localSpawn, localId, {
      rimColor: this.holeRimColor,
      rimStyle: this.holeRimStyle
    }).grantSpawnProtection(spawnProtectionNow);

    for (let i = 0; i < this.currentConfig.botCount; i += 1) {
      const nameBase = BOT_NAMES[i % BOT_NAMES.length];
      const suffix = i >= BOT_NAMES.length ? ` ${Math.floor(i / BOT_NAMES.length) + 1}` : '';
      const difficulty = getBotDifficultyForIndex(i, this.currentConfig.botDifficultyMix);
      const profile = BOT_DIFFICULTY_PROFILES[difficulty];
      const bot = this.playerManager.createBot(
        `bot-${i}`,
        `${nameBase}${suffix} [${profile.shortLabel}]`,
        this.world.getSpawnPoint(i + 1),
        i + 1,
        difficulty
      );
      bot.grantSpawnProtection(spawnProtectionNow);
      this.botManager.addBotController(new BotController(bot, difficulty));
    }

    this.sceneManager.loadWorld(this.world, this.language);
    this.sceneManager.setDayNightMode(preparedConfig.dayNightMode);
    this.swallowSystem = new SwallowSystem(this.world, this.playerManager, this.currentConfig);
    this.respawnSystem = new RespawnSystem(this.world, this.playerManager, this.currentConfig);
    this.timer = this.shouldUseMatchTimer(this.currentConfig)
      ? new MatchTimer(this.currentConfig.durationSeconds)
      : null;

    this.hud.show({
      onZoomIn: () => this.adjustCameraZoom(-0.08),
      onZoomOut: () => this.adjustCameraZoom(0.08),
      onChatVisibilityChange: (visible) => this.chatUI.setVisible(visible)
    }, this.language);
    this.chatUI.show({
      onSend: (text) => this.addPlayerChat(text),
      onVisibilityChange: (visible) => this.hud.setDisplaySetting('chat', visible)
    }, this.language);
    this.chatUI.clear();
    this.chatUI.setEnabled(this.chatEnabled);
    this.chatUI.setVisible(this.hud.getDisplaySetting('chat'));
    this.addSystemMessage(t(this.language, 'matchStarted'));
    if (this.currentConfig.objective) {
      this.addSystemMessage(`${t(this.language, 'objective')}: ${this.currentConfig.objective.description}`);
    }
    if (this.currentConfig.roomName) {
      this.addSystemMessage(`${this.currentConfig.multiplayer ? t(this.language, 'multiplayerRoom') : t(this.language, 'localRoomPreview')}: ${this.currentConfig.roomName}`);
    }

    this.audioManager.playMatchStart();
    this.startMatchMusicIfEnabled(preparedConfig.mapSize);
    this.state = 'playing';
    this.inputManager.setTouchControlsVisible(true);
    this.lastFrame = performance.now();
  }

  private updateMatch(deltaSeconds: number): void {
    if (!this.world || !this.currentConfig || !this.swallowSystem || !this.respawnSystem) {
      return;
    }

    const localPlayer = this.playerManager.getLocalPlayer();
    const now = performance.now() / 1000;
    for (const player of this.playerManager.all()) {
      player.updatePowerUps(now);
    }

    this.world.updateDynamicObjects(deltaSeconds);
    this.world.rebuildObjectGrid();
    this.currentDisasterSnapshot = this.naturalDisasterSystem.update(deltaSeconds, this.world, this.playerManager);
    if (this.currentDisasterSnapshot.started) {
      this.addSystemMessage(
        tf(this.language, 'naturalDisasterStarted', {
          event: t(this.language, this.naturalDisasterNameKey(this.currentDisasterSnapshot.type))
        })
      );
    }
    const disasterSpeedMultiplier = this.naturalDisasterSystem.playerSpeedMultiplier(this.currentDisasterSnapshot);
    this.localDashCooldown = Math.max(0, this.localDashCooldown - deltaSeconds);
    const dashStepSeconds = Math.min(deltaSeconds, this.localDashRemaining);
    this.localDashRemaining = Math.max(0, this.localDashRemaining - deltaSeconds);
    this.localPowerCooldown = Math.max(0, this.localPowerCooldown - deltaSeconds);
    let activePowerApplied = false;

    if (localPlayer?.alive && !this.chatUI.isInputFocused()) {
      const pointerMovement = this.pointerMovementFor(localPlayer);
      const movement = pointerMovement ?? this.inputManager.getMovementVector().clone();
      if (movement.lengthSq() > 0.001) {
        this.lastAimDirection.copy(movement).normalize();
      }
      const wantsBoost = movement.lengthSq() > 0.001 && this.inputManager.wantsBoost();
      localPlayer.updateResources(deltaSeconds, wantsBoost);
      const speed = localPlayer.getSpeed(localPlayer.isBoosting) * disasterSpeedMultiplier;
      localPlayer.position.x += movement.x * speed * deltaSeconds;
      localPlayer.position.z += movement.z * speed * deltaSeconds;
      const dashVelocity = this.localDashDirection.clone().multiplyScalar(this.localDashRemaining > 0 || dashStepSeconds > 0 ? this.localDashSpeed : 0);
      if (dashStepSeconds > 0) {
        localPlayer.position.x += this.localDashDirection.x * this.localDashSpeed * dashStepSeconds;
        localPlayer.position.z += this.localDashDirection.z * this.localDashSpeed * dashStepSeconds;
      }
      localPlayer.velocity.set(movement.x * speed + dashVelocity.x, 0, movement.z * speed + dashVelocity.z);
      if (localPlayer.hasPowerUp('dash') && movement.lengthSq() > 0.001 && this.inputManager.consumeDashPress() && this.localDashCooldown <= 0) {
        this.startLocalDash(localPlayer, movement);
      }
      if (this.inputManager.consumePowerPress()) {
        activePowerApplied = this.activateLocalPower(localPlayer, movement);
      }
      this.world.clampToArena(localPlayer.position, localPlayer.radius);
    } else if (localPlayer) {
      localPlayer.updateResources(deltaSeconds, false);
      localPlayer.velocity.set(0, 0, 0);
    }

    this.botManager.update(deltaSeconds, this.world, this.playerManager);
    if (this.applyPowerUpEffects(deltaSeconds, now) || activePowerApplied) {
      this.world.rebuildObjectGrid();
    }
    this.collectPowerUps(now);

    const swallowEvents = this.swallowSystem.update(deltaSeconds, now);
    const respawnEvents = this.respawnSystem.update(now);
    this.world.updateRespawns(now, this.playerManager, this.currentConfig.respawnSafeRadius);
    this.world.updatePowerUps(deltaSeconds, now, this.playerManager, this.currentConfig.respawnSafeRadius);
    this.timer?.update(deltaSeconds);

    this.processSwallowEvents(swallowEvents);
    for (const event of respawnEvents) {
      this.addSystemMessage(tf(this.language, 'respawned', { player: event.player.name }));
    }
    this.refreshObjectiveProgress();

    this.updateHud();
    this.updateNetwork(deltaSeconds);
    this.checkMatchEnd();
  }

  private processSwallowEvents(events: SwallowEvent[]): void {
    for (const event of events) {
      switch (event.type) {
        case 'objectSwallowed':
          if (event.player.id === this.playerManager.localPlayerId) {
            this.audioManager.playObjectSwallow(event.object.kind, event.object.category, event.object.mass);
            this.applyObjectiveObjectProgress(event.object);
          }
          this.maybeAnnounceSize(event.player.id);
          break;
        case 'holeSwallowed':
          if (event.victim.id === this.playerManager.localPlayerId) {
            this.audioManager.playDeath();
            this.showDeathNotice(event.attacker.name);
            this.startDeathCamera(event.attacker.id);
          }
          if (event.attacker.id === this.playerManager.localPlayerId && event.victim.id !== this.playerManager.localPlayerId) {
            this.showKillNotice(event.victim.name);
            this.refreshObjectiveProgress();
          }
          this.addSystemMessage(tf(this.language, 'swallowedBy', { victim: event.victim.name, attacker: event.attacker.name }));
          this.broadcastHoleSwallow(event.attacker.id, event.victim.id);
          this.maybeAnnounceSize(event.attacker.id);
          break;
        case 'holeSwallowCompleted':
          if (this.currentConfig?.matchMode === MatchMode.LastHoleStanding) {
            this.addSystemMessage(tf(this.language, 'eliminated', { player: event.victim.name }));
          }
          break;
      }
    }
  }

  private delayInitialPowerUps(delaySeconds: number): void {
    if (!this.world) return;
    const now = performance.now() / 1000;
    this.world.powerUps.forEach((powerUp, index) => {
      powerUp.active = false;
      powerUp.respawnAt = now + delaySeconds + index * 0.12;
    });
  }

  private collectPowerUps(now: number): void {
    if (!this.world) return;
    for (const player of this.playerManager.alivePlayers()) {
      const candidates = this.world.queryPowerUps(player.position, player.radius + 1.4);
      for (const powerUp of candidates) {
        if (getEngineConfig().powerUps[powerUp.type]?.enabled === false) {
          continue;
        }
        const distance = player.position.distanceTo(powerUp.position);
        if (distance > player.radius + powerUp.radius + 0.45) continue;
        powerUp.collect(now);
        if (this.currentConfig?.powerUpRespawnEnabled === false) {
          powerUp.respawnAt = Number.POSITIVE_INFINITY;
        }
        player.addPowerUp(powerUp.type, powerUp.durationSeconds, now);
        this.addSystemMessage(tf(this.language, 'pickedUp', {
          player: player.name,
          powerup: t(this.language, powerUpLabelKey(powerUp.type))
        }));
        if (player.id === this.playerManager.localPlayerId) {
          this.audioManager.playPowerUp(powerUp.type);
        }
      }
    }
  }

  private applyPowerUpEffects(deltaSeconds: number, now: number): boolean {
    if (!this.world) return false;
    const shrinkers = this.playerManager.alivePlayers().filter((player) => player.hasPowerUp('shrink'));
    const magnets = this.playerManager.alivePlayers().filter((player) => player.hasPowerUp('magnet'));
    let appliedPhysics = false;

    for (const object of this.world.objects) {
      if (!object.active || object.swallowAnimation) continue;

      let targetScale = 1;
      for (const player of shrinkers) {
        const range = Math.max(8, player.radius * 4.5);
        if (player.position.distanceToSquared(object.position) <= range * range) {
          targetScale = 0.58;
          break;
        }
      }
      object.temporaryScale += (targetScale - object.temporaryScale) * Math.min(1, deltaSeconds * 5);
    }

    for (const player of magnets) {
      const range = Math.max(12, player.radius * 5.6);
      for (const object of this.world.queryObjects(player.position, range)) {
        if (!object.active || object.swallowAnimation || !canObjectFit(player.radius * 1.15, object.effectiveBoundingRadius)) {
          continue;
        }
        const direction = new THREE.Vector3().subVectors(player.position, object.position);
        direction.y = 0;
        const distance = Math.max(0.1, direction.length());
        if (distance > range) continue;
        direction.normalize();
        this.applyMagnetPhysics(object, direction, distance, range, player.radius, deltaSeconds);
        appliedPhysics = true;
      }
    }

    void now;
    return appliedPhysics;
  }

  private applyMagnetPhysics(
    object: WorldObject,
    direction: THREE.Vector3,
    distance: number,
    range: number,
    playerRadius: number,
    deltaSeconds: number
  ): void {
    const pullFactor = Math.max(0, 1 - distance / range);
    const massDamping = 1 / Math.max(1, Math.sqrt(object.mass) * 0.28);
    const categoryBoost = object.category === 'building'
      ? 0.46
      : object.category === 'traffic'
        ? 0.92
        : object.category === 'pedestrian'
          ? 1.36
          : 1.08;
    const acceleration = MAGNET_PULL_STRENGTH * getEngineConfig().gameplay.magnetStrengthMultiplier * pullFactor * categoryBoost * massDamping;
    const linear = direction.clone().multiplyScalar(acceleration * deltaSeconds);
    linear.y = Math.min(1.3, pullFactor * deltaSeconds * (object.category === 'pedestrian' ? 3.4 : 1.2));

    const side = new THREE.Vector3(-direction.z, 0, direction.x);
    const angularScale = acceleration * deltaSeconds * (object.category === 'building' ? 0.08 : 0.36);
    const angular = new THREE.Vector3(
      direction.z * angularScale,
      side.dot(object.physicsVelocity) * 0.012,
      -direction.x * angularScale
    );
    const tallness = object.size.y / Math.max(0.35, Math.min(object.size.x, object.size.z));
    const topple = pullFactor > 0.2 && (
      object.category === 'pedestrian' ||
      object.kind === 'tree' ||
      object.kind === 'post' ||
      object.kind === 'trafficLight' ||
      object.category === 'traffic' && pullFactor > 0.55 ||
      object.category === 'building' && playerRadius > object.boundingRadius * 0.85 && tallness > 1.25
    );
    const fracture = object.category === 'building' && playerRadius > object.boundingRadius
      ? pullFactor * deltaSeconds * 0.16
      : 0;

    object.applyPhysicsImpulse({ linear, angular, topple, fracture });
  }

  private activateLocalPower(player: Player, movement: THREE.Vector3): boolean {
    if (!this.world || !player.hasPowerUp('gust') || this.localPowerCooldown > 0) {
      return false;
    }

    const direction = movement.lengthSq() > 0.001
      ? movement.clone().normalize()
      : this.lastAimDirection.clone().normalize();
    if (direction.lengthSq() <= 0.001) {
      return false;
    }

    const pushed = this.applyVoidGust(player, direction);
    this.localPowerCooldown = pushed > 0 ? 0.95 : 0.28;
    return pushed > 0;
  }

  private startLocalDash(player: Player, direction: THREE.Vector3): void {
    const dashDirection = direction.clone();
    dashDirection.y = 0;
    if (dashDirection.lengthSq() <= 0.001) {
      return;
    }

    dashDirection.normalize();
    const dashDistance = THREE.MathUtils.clamp(5.8 + player.radius * 0.85, 5.8, 12);
    const dashDuration = THREE.MathUtils.clamp(0.16 + player.radius * 0.006, 0.16, 0.24);
    this.localDashDirection.copy(dashDirection);
    this.localDashSpeed = dashDistance / dashDuration;
    this.localDashRemaining = dashDuration;
    this.localDashCooldown = 0.85;
    player.velocity.addScaledVector(dashDirection, this.localDashSpeed);
  }

  private applyVoidGust(player: Player, direction: THREE.Vector3): number {
    if (!this.world) {
      return 0;
    }

    const range = THREE.MathUtils.clamp(9 + player.radius * 2.7, 9, 24);
    const searchCenter = player.position.clone().addScaledVector(direction, range * 0.52);
    let pushed = 0;

    for (const object of this.world.queryObjects(searchCenter, range + player.radius + 3)) {
      if (!object.active || object.swallowAnimation) {
        continue;
      }

      const toObject = new THREE.Vector3(object.position.x - player.position.x, 0, object.position.z - player.position.z);
      const frontDistance = toObject.dot(direction);
      if (frontDistance < player.radius * 0.35 || frontDistance > range + object.collisionRadius) {
        continue;
      }

      const lateral = Math.sqrt(Math.max(0, toObject.lengthSq() - frontDistance * frontDistance));
      const coneWidth = Math.max(2.4 + player.radius * 0.45, frontDistance * 0.46);
      if (lateral > coneWidth + object.collisionRadius) {
        continue;
      }

      const isHeavyBuilding = object.category === 'building' && player.radius < object.effectiveBoundingRadius * 0.95;
      const isHugeObject = object.mass > Math.max(95, player.radius * player.radius * 18);
      if (isHeavyBuilding || isHugeObject) {
        continue;
      }

      const rangeFalloff = THREE.MathUtils.clamp(1 - frontDistance / Math.max(0.001, range), 0.12, 1);
      const lateralFalloff = THREE.MathUtils.clamp(1 - lateral / Math.max(0.001, coneWidth + object.collisionRadius), 0.18, 1);
      const massDamping = 1 / Math.max(1, Math.sqrt(object.mass) * 0.24);
      const categoryScale = object.category === 'pedestrian'
        ? 1.35
        : object.category === 'traffic'
          ? 1.08
          : object.kind === 'post' || object.kind === 'trafficLight'
            ? 0.92
            : 0.82;
      const strength = (16 + player.radius * 4.2) * rangeFalloff * lateralFalloff * massDamping * categoryScale;
      const linear = direction.clone().multiplyScalar(strength);
      linear.y = object.category === 'pedestrian'
        ? 1.35
        : object.category === 'traffic'
          ? 0.72
          : 0.46;
      const angular = new THREE.Vector3(
        direction.z * strength * 0.08,
        (Math.random() - 0.5) * strength * 0.035,
        -direction.x * strength * 0.08
      );
      object.applyPhysicsImpulse({
        linear,
        angular,
        topple: true,
        fracture: object.category === 'building' ? strength * 0.004 : 0
      });
      pushed += 1;
    }

    return pushed;
  }

  private maybeAnnounceSize(playerId: string): void {
    const player = this.playerManager.get(playerId);
    if (!player) {
      return;
    }

    const milestone = Math.floor(player.radius);
    const previous = this.sizeAnnouncements.get(player.id) ?? 1;
    if (milestone > previous && milestone >= 2) {
      this.sizeAnnouncements.set(player.id, milestone);
      this.addSystemMessage(tf(this.language, 'reachedSize', { player: player.name, size: milestone.toFixed(1) }));
    }
  }

  private updateHud(): void {
    const local = this.playerManager.getLocalPlayer();
    if (local?.alive && this.deathCameraTargetId) {
      this.sceneManager.startRespawnDrop(local);
      this.clearDeathCamera();
    }
    const mode = this.currentConfig?.matchMode ?? MatchMode.Timed;
    this.hud.update(
      local,
      this.playerManager.getLeaderboard(mode),
      this.timer,
      this.playerManager.alivePlayers().length,
      this.createDisasterWarning(),
      this.createObjectiveStatus()
    );
    this.inputManager.setTouchActionAvailability({
      dash: Boolean(local?.alive && local.hasPowerUp('dash')),
      power: Boolean(local?.alive && local.hasPowerUp('gust'))
    });
  }

  private createObjectiveStatus(): HudObjectiveStatus | null {
    const objective = this.currentConfig?.objective;
    if (!objective) {
      return null;
    }

    const progress = Math.min(objective.targetCount, Math.max(0, Math.floor(this.objectiveProgress)));
    return {
      title: objective.title,
      description: objective.description,
      progressLabel: `${progress}/${objective.targetCount}`,
      complete: this.objectiveCompleted
    };
  }

  private createDisasterWarning(): HudDisasterWarning | null {
    if (this.currentDisasterSnapshot.warningType === 'clear' || this.currentDisasterSnapshot.warningSeconds <= 0) {
      return null;
    }

    const seconds = Math.max(1, Math.ceil(this.currentDisasterSnapshot.warningSeconds));
    return {
      title: t(this.language, 'naturalDisasterWarningTitle'),
      message: t(this.language, this.naturalDisasterNameKey(this.currentDisasterSnapshot.warningType)),
      secondsLabel: tf(this.language, 'naturalDisasterWarningSeconds', { seconds })
    };
  }

  private applyObjectiveObjectProgress(object: WorldObject): void {
    const objective = this.currentConfig?.objective;
    if (!objective || this.objectiveCompleted || this.objectiveFailed) {
      return;
    }

    if (objective.type === 'swallowCategory' && object.category === objective.targetCategory) {
      this.objectiveProgress += 1;
    }
    if (objective.type === 'swallowKind' && object.kind === objective.targetKind) {
      this.objectiveProgress += 1;
    }
  }

  private refreshObjectiveProgress(): void {
    const objective = this.currentConfig?.objective;
    const local = this.playerManager.getLocalPlayer();
    if (!objective || !local) {
      return;
    }

    switch (objective.type) {
      case 'eliminateHoles':
        this.objectiveProgress = local.eliminations;
        break;
      case 'score':
        this.objectiveProgress = local.score;
        break;
      case 'swallowCategory':
      case 'swallowKind':
      default:
        break;
    }
  }

  private objectiveTargetReached(): boolean {
    const objective = this.currentConfig?.objective;
    return Boolean(objective && this.objectiveProgress >= objective.targetCount);
  }

  private checkMatchEnd(): void {
    if (!this.currentConfig) {
      return;
    }

    if (this.objectiveTargetReached()) {
      this.endMatch(true);
      return;
    }

    if (
      (this.currentConfig.matchMode === MatchMode.TimeTrial || this.currentConfig.matchMode === MatchMode.Career) &&
      this.timer?.complete
    ) {
      this.endMatch(false);
      return;
    }

    if (this.currentConfig.matchMode === MatchMode.Timed && this.timer?.complete) {
      this.endMatch();
      return;
    }

    if (this.currentConfig.matchMode === MatchMode.LastHoleStanding && this.playerManager.alivePlayers().length <= 1) {
      this.endMatch();
    }
  }

  private endMatch(challengeCompleted?: boolean): void {
    if (this.state === 'ended' || !this.currentConfig) {
      return;
    }

    this.state = 'ended';
    if (this.currentConfig.objective) {
      this.objectiveCompleted = challengeCompleted ?? this.objectiveTargetReached();
      this.objectiveFailed = !this.objectiveCompleted;
      this.addSystemMessage(t(this.language, this.objectiveCompleted ? 'objectiveComplete' : 'objectiveFailed'));
    }
    const result = this.createMatchResult();
    this.recordMatchHistory(result);
    if (!this.currentConfig.objective || this.objectiveCompleted) {
      this.addSystemMessage(tf(this.language, 'wonMatch', { winner: result.winnerName }));
    }
    this.audioManager.playMatchEnd();
    this.pauseMenu.hide();
    this.endScreen.show(result, {
      onPlayAgain: () => {
        if (this.lastConfig) {
          this.startMatch(this.lastConfig);
        }
      },
      onMainMenu: () => this.showMainMenu()
    }, this.profileStore.recent(), this.language);
  }

  private createMatchResult(): MatchResult {
    const mode = this.currentConfig?.matchMode ?? MatchMode.Timed;
    const leaderboard = this.playerManager.getLeaderboard(mode);
    const local = this.playerManager.getLocalPlayer();
    const winner = leaderboard[0];
    const placement = Math.max(1, leaderboard.findIndex((entry) => entry.id === local?.id) + 1);
    const objective = this.currentConfig?.objective;
    const winnerName = objective
      ? this.objectiveCompleted
        ? local?.name ?? t(this.language, 'playerFallback')
        : t(this.language, 'noWinner')
      : winner?.name ?? t(this.language, 'noWinner');

    return {
      winnerName,
      placement,
      finalScore: local?.score ?? 0,
      finalRadius: local?.radius ?? 1,
      objectsSwallowed: local?.swallowedObjects ?? 0,
      eliminations: local?.eliminations ?? 0,
      challengeCompleted: objective ? this.objectiveCompleted : undefined,
      objectiveTitle: objective?.title,
      objectiveProgress: objective ? Math.floor(this.objectiveProgress) : undefined,
      objectiveTarget: objective?.targetCount
    };
  }

  private recordMatchHistory(result: MatchResult): void {
    if (!this.currentConfig) {
      return;
    }

    const mode = this.currentConfig.matchMode;
    const leaderboard = this.playerManager.getLeaderboard(mode);
    const local = this.playerManager.getLocalPlayer();
    const playerName = (local?.name ?? this.playerName) || t(this.language, 'playerFallback');
    this.profileStore.getOrCreate(playerName);
    this.profileStore.recordMatch({
      ...result,
      playerName,
      playedAt: new Date().toISOString(),
      mapSize: this.currentConfig.mapSize,
      matchMode: mode,
      multiplayer: this.currentConfig.multiplayer,
      roomName: this.currentConfig.roomName,
      durationSeconds: this.currentConfig.durationSeconds,
      leaderboard
    });
  }

  private activateProfile(playerName: string): string {
    const safeName = playerName.trim() || `Player_${Math.floor(1000 + Math.random() * 9000)}`;
    const profile = this.profileStore.getOrCreate(safeName);
    this.profileStore.updateAppearance(profile.playerName, this.holeRimColor, this.holeRimStyle);
    this.profileStore.updateLanguage(profile.playerName, this.language);
    this.saveAudioPreferences(profile.playerName);
    this.playerName = profile.playerName;
    return profile.playerName;
  }

  private bindNetworkHooks(): void {
    if (this.networkHooksBound) {
      return;
    }

    this.networkClient.onPlayerStates((states) => this.applyRemotePlayerStates(states));
    this.networkClient.onChat((message) => this.addChatMessage(message));
    this.networkClient.onHoleSwallowed((payload) => this.applyNetworkHoleSwallow(payload));
    this.networkHooksBound = true;
  }

  private broadcastHoleSwallow(attackerId: string, victimId: string): void {
    if (
      !this.currentConfig?.multiplayer ||
      !this.currentConfig.roomId ||
      !this.networkClient.connected ||
      attackerId !== this.playerManager.localPlayerId
    ) {
      return;
    }

    this.networkClient.sendHoleSwallowed(this.currentConfig.roomId, attackerId, victimId);
  }

  private applyNetworkHoleSwallow(payload: {
    attackerId: string;
    victimId: string;
    timestamp: number;
  }): void {
    if (!this.currentConfig?.multiplayer) {
      return;
    }

    if (payload.attackerId === this.playerManager.localPlayerId) {
      return;
    }

    const key = `${payload.attackerId}:${payload.victimId}:${payload.timestamp}`;
    if (this.appliedNetworkSwallows.has(key)) {
      return;
    }
    this.appliedNetworkSwallows.add(key);

    const attacker = this.playerManager.get(payload.attackerId);
    const victim = this.playerManager.get(payload.victimId);
    if (!victim || !victim.alive) {
      return;
    }

    const now = performance.now() / 1000;
    if (victim.isSpawnProtected(now)) {
      return;
    }
    victim.markSwallowed(payload.attackerId, now);
    if (attacker) {
      attacker.addMass(Math.max(6, victim.mass * 0.28 + victim.radius * 5));
      attacker.addScore(150 + victim.score * 0.2 + victim.radius * 45);
      attacker.eliminations += 1;
      this.addSystemMessage(tf(this.language, 'swallowedBy', { victim: victim.name, attacker: attacker.name }));
      if (victim.id === this.playerManager.localPlayerId) {
        this.audioManager.playDeath();
        this.showDeathNotice(attacker.name);
        this.startDeathCamera(attacker.id);
      }
    } else if (victim.id === this.playerManager.localPlayerId) {
      this.audioManager.playDeath();
      this.showDeathNotice(t(this.language, 'voidFallback'));
      this.clearDeathCamera();
    }
  }

  private updateNetwork(deltaSeconds: number): void {
    if (!this.currentConfig?.multiplayer || !this.currentConfig.roomId || !this.networkClient.connected) {
      return;
    }

    this.networkSendAccumulator += deltaSeconds;
    if (this.networkSendAccumulator < 0.08) {
      return;
    }
    this.networkSendAccumulator = 0;

    const local = this.playerManager.getLocalPlayer();
    if (!local) return;
    const state: ServerPlayerState = {
      id: local.id,
      name: local.name,
      x: local.position.x,
      z: local.position.z,
      radius: local.radius,
      score: local.score,
      mass: local.mass,
      rimColor: local.rimColor,
      rimStyle: local.rimStyle,
      alive: local.alive,
      stamina: local.stamina,
      eliminations: local.eliminations,
      swallowedObjects: local.swallowedObjects,
      spawnProtectionRemaining: local.spawnProtectionRemaining(performance.now() / 1000)
    };
    this.networkClient.sendPlayerState(this.currentConfig.roomId, state);
  }

  private applyRemotePlayerStates(states: ServerPlayerState[]): void {
    if (!this.world || !this.currentConfig?.multiplayer) {
      return;
    }

    const localId = this.playerManager.localPlayerId;
    const seenRemoteIds = new Set<string>();
    states.forEach((state, index) => {
      if (state.id === localId) return;
      seenRemoteIds.add(state.id);
      let player = this.playerManager.get(state.id);
      if (!player) {
        player = this.playerManager.createRemotePlayer(
          state.id,
          state.name,
          new THREE.Vector3(state.x, 0, state.z),
          index + 3,
          {
            rimColor: state.rimColor,
            rimStyle: state.rimStyle
          }
        );
      }
      player.name = state.name;
      player.rimColor = state.rimColor || player.rimColor;
      player.rimStyle = state.rimStyle || player.rimStyle;
      player.position.lerp(new THREE.Vector3(state.x, 0, state.z), 0.45);
      player.radius = state.radius;
      player.mass = state.mass;
      player.score = state.score;
      player.stamina = state.stamina;
      player.alive = state.alive;
      player.renderVisible = state.alive;
      player.eliminations = state.eliminations;
      player.swallowedObjects = state.swallowedObjects;
      player.spawnProtectionUntil = performance.now() / 1000 + Math.max(0, state.spawnProtectionRemaining ?? 0);
    });

    for (const player of this.playerManager.all()) {
      if (player.id !== localId && !player.isBot && !seenRemoteIds.has(player.id)) {
        this.playerManager.remove(player.id);
      }
    }
  }

  private showPause(): void {
    if (!this.currentConfig) {
      return;
    }

    this.state = 'paused';
    this.inputManager.clear();
    this.inputManager.setTouchControlsVisible(false);
    this.pauseMenu.show(
      {
        onResume: () => this.resumeMatch(),
        onBackToMenu: () => this.showMainMenu(),
        onChatToggle: (enabled) => {
          this.chatEnabled = enabled;
          this.chatUI.setEnabled(enabled);
          if (this.currentConfig) {
            this.currentConfig.enableChat = enabled;
          }
        },
        onDeathCameraToggle: (enabled) => {
          this.deathCameraEnabled = enabled;
          if (this.currentConfig) {
            this.currentConfig.deathCameraEnabled = enabled;
          }
          if (!enabled) {
            this.clearDeathCamera();
          }
        },
        onHudDisplayToggle: (key, visible) => {
          this.hud.setDisplaySetting(key, visible);
          if (key === 'chat') {
            this.chatUI.setVisible(visible);
          }
        },
        onNextMusic: () => this.nextMusicTrack(),
        onStopMusic: () => this.stopMusicForProfile(),
        onAudioSettingsChange: (settings) => this.applyAudioSettings(settings),
        onGraphicsQualityChange: (quality) => this.applyGraphicsQuality(quality),
        onSkyEffectsToggle: (enabled) => this.applyVisualSetting('skyEffectsEnabled', enabled),
        onLightingEffectsToggle: (enabled) => this.applyVisualSetting('lightingEffectsEnabled', enabled),
        onHoleAppearanceChange: (rimColor, rimStyle) => this.applyHoleAppearance(rimColor, rimStyle),
        onLanguageChange: (language) => this.applyLanguage(language),
        onControlConfigChange: (controls) => this.applyControlConfig(controls)
      },
      {
        chatEnabled: this.chatEnabled,
        inMatch: true,
        deathCameraEnabled: this.deathCameraEnabled,
        hudDisplaySettings: this.hud.getDisplaySettings(),
        holeRimColor: this.holeRimColor,
        holeRimStyle: this.holeRimStyle,
        graphicsQuality: this.currentConfig.graphicsQuality,
        language: this.language,
        controlsConfig: getEngineConfig().controls,
        skyEffectsEnabled: getEngineConfig().visual.skyEffectsEnabled,
        lightingEffectsEnabled: getEngineConfig().visual.lightingEffectsEnabled,
        musicEnabled: this.musicEnabled
      }
    );
  }

  private readonly handleAdminHotkey = (event: KeyboardEvent): void => {
    if (!event.ctrlKey || !event.altKey || event.key.toLowerCase() !== 'e') {
      return;
    }
    event.preventDefault();
    this.showAdminEnginePanel();
  };

  private showAdminEnginePanel(): void {
    if (this.adminEnginePanel.visible) {
      return;
    }

    this.adminPanelWasPlaying = this.state === 'playing';
    if (this.adminPanelWasPlaying) {
      this.state = 'paused';
      this.inputManager.clear();
      this.inputManager.setTouchControlsVisible(false);
    }

    this.adminEnginePanel.show({
      onClose: () => this.closeAdminEnginePanel(),
      onApply: (config) => this.applyEngineConfigRuntime(config)
    });
  }

  private closeAdminEnginePanel(): void {
    this.adminEnginePanel.hide();
    if (this.adminPanelWasPlaying && this.currentConfig) {
      this.state = 'playing';
      this.inputManager.setTouchControlsVisible(true);
      this.lastFrame = performance.now();
    }
    this.adminPanelWasPlaying = false;
  }

  private applyEngineConfigRuntime(config: EngineConfig): void {
    document.documentElement.style.setProperty('--menu-font', `"${config.branding.menuFont}", "Open Sans", sans-serif`);
    document.documentElement.style.setProperty('--text-font', `"${config.branding.textFont}", "Open Sans", sans-serif`);
    this.inputManager?.setControlsConfig(config.controls);
    this.sceneManager?.setSkyEffectsEnabled(config.visual.skyEffectsEnabled);
    this.sceneManager?.setLightingEffectsEnabled(config.visual.lightingEffectsEnabled);
    if (this.currentConfig) {
      this.currentConfig.enableAds = this.currentConfig.enableAds && config.generation.adsEnabled;
    }
    if ((this.state === 'playing' || this.state === 'paused') && this.currentConfig) {
      this.startMatchMusicIfEnabled(this.currentConfig.mapSize);
    } else if (this.state === 'menu' || this.state === 'setup') {
      this.startMenuMusicIfEnabled();
    }
  }

  private applyProfileAudioPreferences(profile: { audioPreferences: PlayerAudioPreferences }): void {
    this.audioManager.setSfxVolume(profile.audioPreferences.sfxVolume);
    this.audioManager.setMusicVolume(profile.audioPreferences.musicVolume);
    this.musicEnabled = profile.audioPreferences.musicEnabled;
  }

  private applyAudioSettings(settings: PlayerAudioPreferences): void {
    this.audioManager.setSfxVolume(settings.sfxVolume);
    this.audioManager.setMusicVolume(settings.musicVolume);
    this.musicEnabled = settings.musicEnabled;
    this.saveAudioPreferences();
  }

  private saveAudioPreferences(playerName = this.playerName || this.profileStore.load()?.playerName): void {
    if (!playerName) {
      return;
    }
    this.profileStore.updateAudioPreferences(playerName, {
      sfxVolume: this.audioManager.getSfxVolume(),
      musicVolume: this.audioManager.getMusicVolume(),
      musicEnabled: this.musicEnabled
    });
  }

  private startMenuMusicIfEnabled(): void {
    if (!this.musicEnabled) {
      this.audioManager.stopMusic();
      return;
    }
    this.audioManager.startMenuMusic();
  }

  private startMatchMusicIfEnabled(mapSize: MatchConfig['mapSize']): void {
    if (!this.musicEnabled) {
      this.audioManager.stopMusic();
      return;
    }
    this.audioManager.startMusic(mapSize);
  }

  private nextMusicTrack(): void {
    this.musicEnabled = true;
    if ((this.state === 'playing' || this.state === 'paused') && this.currentConfig) {
      this.audioManager.startMusic(this.currentConfig.mapSize);
    } else {
      this.audioManager.startMenuMusic();
    }
    this.audioManager.nextMusicTrack();
    this.saveAudioPreferences();
  }

  private stopMusicForProfile(): void {
    this.musicEnabled = false;
    this.audioManager.stopMusic();
    this.saveAudioPreferences();
  }

  private applyControlConfig(controls: EngineControlsConfig): void {
    const current = getEngineConfig();
    const updated = saveEngineConfig({
      ...current,
      controls
    });
    this.applyEngineConfigRuntime(updated);
  }

  private resumeMatch(): void {
    this.pauseMenu.hide();
    if (this.currentConfig) {
      this.state = 'playing';
      this.inputManager.setTouchControlsVisible(true);
      this.lastFrame = performance.now();
    } else {
      this.state = 'menu';
    }
  }

  private showSettingsOverlay(inMatch: boolean): void {
    this.pauseMenu.show(
      {
        onResume: () => this.pauseMenu.hide(),
        onBackToMenu: () => this.showMainMenu(),
        onChatToggle: (enabled) => {
          this.chatEnabled = enabled;
          this.chatUI.setEnabled(enabled);
        },
        onDeathCameraToggle: (enabled) => {
          this.deathCameraEnabled = enabled;
          if (this.currentConfig) {
            this.currentConfig.deathCameraEnabled = enabled;
          }
          if (!enabled) {
            this.clearDeathCamera();
          }
        },
        onHudDisplayToggle: (key, visible) => {
          this.hud.setDisplaySetting(key, visible);
          if (key === 'chat') {
            this.chatUI.setVisible(visible);
          }
        },
        onNextMusic: () => this.nextMusicTrack(),
        onStopMusic: () => this.stopMusicForProfile(),
        onAudioSettingsChange: (settings) => this.applyAudioSettings(settings),
        onGraphicsQualityChange: (quality) => this.applyGraphicsQuality(quality),
        onSkyEffectsToggle: (enabled) => this.applyVisualSetting('skyEffectsEnabled', enabled),
        onLightingEffectsToggle: (enabled) => this.applyVisualSetting('lightingEffectsEnabled', enabled),
        onHoleAppearanceChange: (rimColor, rimStyle) => this.applyHoleAppearance(rimColor, rimStyle),
        onLanguageChange: (language) => {
          this.applyLanguage(language);
          this.showSettingsOverlay(inMatch);
        },
        onControlConfigChange: (controls) => this.applyControlConfig(controls)
      },
      {
        chatEnabled: this.chatEnabled,
        inMatch,
        deathCameraEnabled: this.deathCameraEnabled,
        hudDisplaySettings: this.hud.getDisplaySettings(),
        holeRimColor: this.holeRimColor,
        holeRimStyle: this.holeRimStyle,
        graphicsQuality: this.currentConfig?.graphicsQuality,
        language: this.language,
        controlsConfig: getEngineConfig().controls,
        skyEffectsEnabled: getEngineConfig().visual.skyEffectsEnabled,
        lightingEffectsEnabled: getEngineConfig().visual.lightingEffectsEnabled,
        musicEnabled: this.musicEnabled
      }
    );
  }

  private pointerMovementFor(localPlayer: { position: THREE.Vector3; radius: number }): THREE.Vector3 | null {
    const pointerTarget = this.inputManager.getPointerTarget();
    if (!pointerTarget) {
      return null;
    }

    const groundPoint = this.sceneManager.clientPointToGround(pointerTarget.x, pointerTarget.y);
    if (!groundPoint) {
      return null;
    }

    const direction = new THREE.Vector3(
      groundPoint.x - localPlayer.position.x,
      0,
      groundPoint.z - localPlayer.position.z
    );
    const distance = direction.length();
    if (distance <= Math.max(0.35, localPlayer.radius * 0.2)) {
      return null;
    }

    return direction.multiplyScalar(1 / distance);
  }

  private applyHoleAppearance(rimColor: string, rimStyle: HoleRimStyle): void {
    this.holeRimColor = rimColor;
    this.holeRimStyle = rimStyle;
    const local = this.playerManager.getLocalPlayer();
    if (local) {
      local.rimColor = rimColor;
      local.rimStyle = rimStyle;
    }
    if (this.currentConfig) {
      this.currentConfig.holeRimColor = rimColor;
      this.currentConfig.holeRimStyle = rimStyle;
    }
    const name = this.playerName || this.profileStore.load()?.playerName;
    if (name) {
      this.profileStore.updateAppearance(name, rimColor, rimStyle);
    }
  }

  private applyLanguage(language: LanguageCode, playerName = this.playerName): void {
    this.language = language;
    this.hud?.setLanguage(language);
    this.chatUI?.setLanguage(language);
    const name = playerName || this.profileStore.load()?.playerName;
    if (name) {
      this.profileStore.updateLanguage(name, language);
    }
  }

  private applyGraphicsQuality(quality: GraphicsQuality): void {
    this.sceneManager.setGraphicsQuality(quality);
    if (this.currentConfig) {
      this.currentConfig.graphicsQuality = quality;
    }
    if (this.lastConfig) {
      this.lastConfig.graphicsQuality = quality;
    }
  }

  private applyVisualSetting(key: 'skyEffectsEnabled' | 'lightingEffectsEnabled', enabled: boolean): void {
    const current = getEngineConfig();
    const updated = saveEngineConfig({
      ...current,
      visual: {
        ...current.visual,
        [key]: enabled
      }
    });
    this.applyEngineConfigRuntime(updated);
  }

  private handleEscape(): void {
    if (this.adminEnginePanel?.visible) {
      this.closeAdminEnginePanel();
      return;
    }

    if (this.chatUI.handleEscape()) {
      return;
    }

    if (this.state === 'playing') {
      this.showPause();
      return;
    }

    if (this.state === 'paused') {
      this.resumeMatch();
      return;
    }

    if (this.state === 'menu' || this.state === 'setup') {
      this.pauseMenu.hide();
    }
  }

  private handleEnter(): void {
    if (this.state === 'playing' && this.chatEnabled) {
      this.chatUI.handleEnter();
    }
  }

  private addPlayerChat(text: string): void {
    const local = this.playerManager.getLocalPlayer();
    if (this.currentConfig?.multiplayer && this.currentConfig.roomId && this.networkClient.connected) {
      this.networkClient.sendChat(this.currentConfig.roomId, local?.name ?? this.playerName, text);
      return;
    }

    this.addChatMessage({
      id: this.createMessageId(),
      sender: local?.name ?? this.playerName,
      text,
      system: false,
      timestamp: Date.now()
    });
  }

  private addSystemMessage(text: string): void {
    this.addChatMessage({
      id: this.createMessageId(),
      sender: 'System',
      text,
      system: true,
      timestamp: Date.now()
    });
  }

  private addChatMessage(message: ChatMessage): void {
    this.chatUI.addMessage(message);
  }

  private createMessageId(): string {
    const id = `msg-${this.messageId}`;
    this.messageId += 1;
    return id;
  }

  private createMockRooms(): MockRoomSummary[] {
    return [
      {
        id: 'room-1',
        roomName: 'Midnight Grid',
        mapSize: 'medium',
        players: 5,
        maxPlayers: 16,
        botsEnabled: true,
        matchMode: MatchMode.Timed
      },
      {
        id: 'room-2',
        roomName: 'Rooftop Collapse',
        mapSize: 'large',
        players: 24,
        maxPlayers: 32,
        botsEnabled: false,
        matchMode: MatchMode.LastHoleStanding
      },
      {
        id: 'room-3',
        roomName: 'Sponsor Square',
        mapSize: 'huge',
        players: 64,
        maxPlayers: 100,
        botsEnabled: true,
        matchMode: MatchMode.Timed
      }
    ];
  }

  private clearMatch(): void {
    const wasMultiplayer = Boolean(this.currentConfig?.multiplayer);
    this.clearDeathCamera();
    this.world = null;
    this.menuWorld = null;
    this.menuPreviewElapsed = 0;
    this.swallowSystem = null;
    this.respawnSystem = null;
    this.timer = null;
    this.currentConfig = null;
    this.playerManager.clear();
    this.botManager.clear();
    this.appliedNetworkSwallows.clear();
    this.localHoleCombo = 0;
    this.lastLocalHoleKillAt = 0;
    this.localDashCooldown = 0;
    this.localDashRemaining = 0;
    this.localDashSpeed = 0;
    this.localDashDirection.set(0, 0, 0);
    this.localPowerCooldown = 0;
    this.lastAimDirection.set(0, 0, -1);
    this.objectiveProgress = 0;
    this.objectiveCompleted = false;
    this.objectiveFailed = false;
    this.naturalDisasterSystem.reset();
    this.currentDisasterSnapshot = CLEAR_NATURAL_DISASTER;
    this.sceneManager?.clearWorld();
    this.audioManager.stopMusic();
    this.inputManager?.setTouchControlsVisible(false);
    this.hideDeathNotice();
    this.hideKillNotice();
    if (wasMultiplayer) {
      this.networkClient.disconnect();
      this.networkHooksBound = false;
    }
  }

  private hideMenus(): void {
    this.mainMenu?.hide();
    this.matchSetupMenu?.hide();
    this.findGamesMenu?.hide();
    this.hostMenu?.hide();
    this.soloPresetMenu?.hide();
    this.pauseMenu?.hide();
  }

  private naturalDisasterNameKey(type: NaturalDisasterType): TranslationKey {
    switch (type) {
      case 'rain':
        return 'disasterRain';
      case 'thunderstorm':
        return 'disasterThunderstorm';
      case 'earthquake':
        return 'disasterEarthquake';
      case 'meteorShower':
        return 'disasterMeteorShower';
      case 'sandstorm':
        return 'disasterSandstorm';
      case 'clear':
      default:
        return 'disasterClear';
    }
  }

  private effectiveObjectDensityMultiplier(config: MatchConfig): number {
    let multiplier = config.objectDensityMultiplier * getEngineConfig().generation.objectDensityMultiplier;
    const mapCap = {
      small: 1.08,
      medium: 1,
      large: 0.96,
      huge: 0.78
    } satisfies Record<MatchConfig['mapSize'], number>;

    multiplier = Math.min(multiplier, mapCap[config.mapSize]);
    if (config.graphicsQuality === 'performance') {
      multiplier = Math.min(multiplier, 0.72);
    }
    if (this.isLikelyLowPowerDevice()) {
      multiplier = Math.min(multiplier, config.mapSize === 'huge' ? 0.58 : 0.82);
    }

    return multiplier;
  }

  private isLikelyLowPowerDevice(): boolean {
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    return (
      window.devicePixelRatio >= 2.5 ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
      (typeof navigatorWithMemory.deviceMemory === 'number' && navigatorWithMemory.deviceMemory <= 4)
    );
  }

  private adjustCameraZoom(delta: number): void {
    this.cameraZoom = THREE.MathUtils.clamp(this.cameraZoom + delta, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
    if (this.currentConfig) {
      this.currentConfig.cameraZoom = this.cameraZoom;
    }
  }

  private startDeathCamera(attackerId: string): void {
    if (!this.deathCameraEnabled) {
      return;
    }

    this.deathCameraTargetId = attackerId;
    this.deathCameraElapsed = 0;
  }

  private clearDeathCamera(): void {
    this.deathCameraTargetId = null;
    this.deathCameraElapsed = 0;
    this.setDeathFade(0);
  }

  private updateDeathFade(): void {
    const progress = THREE.MathUtils.smoothstep(this.deathCameraElapsed, 1.02, 1.55);
    this.setDeathFade(progress);
  }

  private setDeathFade(opacity: number): void {
    if (!this.deathFade) {
      return;
    }
    this.deathFade.style.opacity = `${THREE.MathUtils.clamp(opacity, 0, 1)}`;
  }

  private loadMenuPreview(): void {
    const mapData = this.mapGenerator.generate({
      size: 'medium',
      enableAds: true,
      seed: 'void-arena-menu-city',
      objectDensityMultiplier: this.isLikelyLowPowerDevice() ? 0.52 : 0.68,
      powerUpCount: 0
    });
    this.menuWorld = new World(mapData);
    this.sceneManager.setGraphicsQuality('balanced');
    this.sceneManager.loadWorld(this.menuWorld, this.language);
    this.sceneManager.setDayNightMode('cycle');
  }

  private showDeathNotice(attackerName: string): void {
    window.clearTimeout(this.deathNoticeTimer);
    const phrases = [
      tf(this.language, 'deathPhrase1', { attacker: attackerName }),
      tf(this.language, 'deathPhrase2', { attacker: attackerName }),
      tf(this.language, 'deathPhrase3', { attacker: attackerName }),
      tf(this.language, 'deathPhrase4', { attacker: attackerName }),
      tf(this.language, 'deathPhrase5', { attacker: attackerName })
    ];
    this.deathNotice.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    this.deathNotice.classList.remove('hidden');
    this.deathNotice.classList.remove('show');
    void this.deathNotice.offsetWidth;
    this.deathNotice.classList.add('show');
    this.deathNoticeTimer = window.setTimeout(() => this.hideDeathNotice(), 2400);
  }

  private hideDeathNotice(): void {
    window.clearTimeout(this.deathNoticeTimer);
    this.deathNotice?.classList.remove('show');
    this.deathNotice?.classList.add('hidden');
  }

  private showKillNotice(victimName: string): void {
    window.clearTimeout(this.killNoticeTimer);
    const now = performance.now() / 1000;
    this.localHoleCombo = now - this.lastLocalHoleKillAt <= 3 ? this.localHoleCombo + 1 : 1;
    this.lastLocalHoleKillAt = now;

    const main = document.createElement('div');
    main.className = 'kill-notice-main';
    main.textContent = tf(this.language, 'killNoticeMain', { victim: victimName });

    const combo = document.createElement('div');
    combo.className = 'kill-notice-combo';
    combo.textContent = this.localHoleCombo > 1
      ? tf(this.language, 'killNoticeCombo', { count: this.localHoleCombo })
      : t(this.language, 'killNoticeFeed');

    const sub = document.createElement('div');
    sub.className = 'kill-notice-sub';
    sub.textContent =
      this.localHoleCombo > 1
        ? t(this.language, 'killNoticeContinue')
        : t(this.language, 'killNoticeNext');

    this.killNotice.replaceChildren(main, combo, sub);
    this.killNotice.classList.remove('hidden');
    this.killNotice.classList.remove('show');
    void this.killNotice.offsetWidth;
    this.killNotice.classList.add('show');
    this.killNoticeTimer = window.setTimeout(() => this.hideKillNotice(), 1850);
  }

  private hideKillNotice(): void {
    window.clearTimeout(this.killNoticeTimer);
    this.killNotice?.classList.remove('show');
    this.killNotice?.classList.add('hidden');
  }

  private bindCameraZoomControls(): void {
    window.addEventListener('keydown', this.handleZoomKeyDown);
    this.sceneLayer.addEventListener('wheel', this.handleZoomWheel, { passive: false });
  }

  private readonly handleZoomKeyDown = (event: KeyboardEvent): void => {
    if (this.state !== 'playing' || event.repeat || this.isTypingTarget(event.target)) {
      return;
    }

    if (event.code === 'Equal' || event.code === 'NumpadAdd') {
      event.preventDefault();
      this.adjustCameraZoom(-0.08);
      return;
    }

    if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
      event.preventDefault();
      this.adjustCameraZoom(0.08);
    }
  };

  private readonly handleZoomWheel = (event: WheelEvent): void => {
    if (this.state !== 'playing' || this.isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    this.adjustCameraZoom(event.deltaY < 0 ? -0.06 : 0.06);
  };

  private isTypingTarget(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    );
  }

  private bindUiButtonSounds(): void {
    this.uiLayer.addEventListener('pointerover', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest('button');
      if (!button || !this.uiLayer.contains(button)) {
        return;
      }

      const related = event.relatedTarget as Node | null;
      if (related && button.contains(related)) {
        return;
      }

      this.audioManager.playButtonHover();
    });

    this.uiLayer.addEventListener(
      'click',
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const button = target.closest('button');
        if (!button || !this.uiLayer.contains(button) || button.disabled) {
          return;
        }

        this.audioManager.playButtonClick();
      },
      { capture: true }
    );
  }

  private bindAudioUnlock(): void {
    window.addEventListener('pointerdown', this.handleAudioUnlock, { capture: true });
    window.addEventListener('touchstart', this.handleAudioUnlock, { capture: true, passive: true });
    window.addEventListener('keydown', this.handleAudioUnlock, { capture: true });
  }

  private readonly handleAudioUnlock = (): void => {
    this.audioManager.unlock();
  };

  dispose(): void {
    window.cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.handleZoomKeyDown);
    window.removeEventListener('pointerdown', this.handleAudioUnlock, { capture: true });
    window.removeEventListener('touchstart', this.handleAudioUnlock, { capture: true });
    window.removeEventListener('keydown', this.handleAudioUnlock, { capture: true });
    this.sceneLayer?.removeEventListener('wheel', this.handleZoomWheel);
    this.inputManager.dispose();
    this.sceneManager.dispose();
    this.audioManager.stopMusic();
  }
}
