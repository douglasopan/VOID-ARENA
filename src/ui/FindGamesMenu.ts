import { MatchMode, getMatchModeLabel } from '../game/MatchMode';
import { t } from '../i18n/I18n';
import type { LanguageCode, MockRoomSummary } from '../shared/types';
import type { ServerRoomSummary } from '../../server/shared/serverTypes';

export interface FindGamesCallbacks {
  onJoin: (room: MockRoomSummary | ServerRoomSummary) => void;
  onBack: () => void;
}

export class FindGamesMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(rooms: Array<MockRoomSummary | ServerRoomSummary>, callbacks: FindGamesCallbacks, language: LanguageCode = 'en'): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel">
        <h2>${t(language, 'findGames')}</h2>
        <p class="subtitle">${t(language, 'findGamesSubtitle')}</p>
        <div class="rooms">
          ${rooms
            .map(
              (room) => `
                <div class="room-row" data-room-id="${room.id}">
                  <div>
                    <div class="room-name">${room.roomName}</div>
                    <div class="muted">${room.mapSize.toUpperCase()} ${t(language, 'map')}</div>
                  </div>
                  <div>${room.players}/${room.maxPlayers}</div>
                  <div>${room.botsEnabled ? ('bots' in room ? `${t(language, 'bots')} ${room.bots}` : t(language, 'botsOn')) : t(language, 'botsOff')}</div>
                  <div>${this.matchModeLabel(room.matchMode, language)}</div>
                  <div>${room.mapSize}</div>
                  <button class="join">${t(language, 'join')}</button>
                </div>`
            )
            .join('')}
        </div>
        <div class="button-grid">
          <button class="back">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    element.querySelectorAll<HTMLButtonElement>('.join').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.closest<HTMLElement>('.room-row')?.dataset.roomId;
        const room = rooms.find((candidate) => candidate.id === id);
        if (room) callbacks.onJoin(room);
      });
    });
    element.querySelector('.back')?.addEventListener('click', callbacks.onBack);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private matchModeLabel(mode: MatchMode, language: LanguageCode): string {
    if (mode === MatchMode.Timed) return t(language, 'timedMatch');
    if (mode === MatchMode.LastHoleStanding) return t(language, 'lastHoleStanding');
    if (mode === MatchMode.EliminationRush) return t(language, 'eliminationRushMode');
    if (mode === MatchMode.TimeTrial) return t(language, 'timeTrialMode');
    if (mode === MatchMode.Creative) return t(language, 'creativeMode');
    return getMatchModeLabel(mode);
  }
}
