import { getMatchModeLabel } from '../game/MatchMode';
import type { MockRoomSummary } from '../shared/types';
import type { ServerRoomSummary } from '../../server/shared/serverTypes';

export interface FindGamesCallbacks {
  onJoin: (room: MockRoomSummary | ServerRoomSummary) => void;
  onBack: () => void;
}

export class FindGamesMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(rooms: Array<MockRoomSummary | ServerRoomSummary>, callbacks: FindGamesCallbacks): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel">
        <h2>Find Games</h2>
        <p class="subtitle">Rooms come from the local Socket.IO server when it is running; mock rooms appear only as an offline fallback.</p>
        <div class="rooms">
          ${rooms
            .map(
              (room) => `
                <div class="room-row" data-room-id="${room.id}">
                  <div>
                    <div class="room-name">${room.roomName}</div>
                    <div class="muted">${room.mapSize.toUpperCase()} map</div>
                  </div>
                  <div>${room.players}/${room.maxPlayers}</div>
                  <div>${room.botsEnabled ? `Bots ${'bots' in room ? room.bots : 'on'}` : 'Bots off'}</div>
                  <div>${getMatchModeLabel(room.matchMode)}</div>
                  <div>${room.mapSize}</div>
                  <button class="join">Join</button>
                </div>`
            )
            .join('')}
        </div>
        <div class="button-grid">
          <button class="back">Back</button>
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
}
