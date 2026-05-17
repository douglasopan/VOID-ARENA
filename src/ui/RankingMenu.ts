import { t } from '../i18n/I18n';
import type { LanguageCode, PublicPlayerProfile } from '../shared/types';

export type RankingFilter =
  | 'matches'
  | 'kills'
  | 'wins'
  | 'timedWins'
  | 'lastHoleStandingWins'
  | 'eliminationRushWins'
  | 'timeTrialWins'
  | 'careerWins'
  | 'bestScore';

export interface RankingMenuCallbacks {
  onBack: () => void;
  onOpenProfile: (accountId: string) => void;
}

const FILTERS: RankingFilter[] = [
  'matches',
  'kills',
  'wins',
  'timedWins',
  'lastHoleStandingWins',
  'eliminationRushWins',
  'timeTrialWins',
  'careerWins',
  'bestScore'
];

export class RankingMenu {
  private element: HTMLDivElement | null = null;
  private activeFilter: RankingFilter = 'wins';
  private page = 0;
  private pageSize = 50;

  constructor(private readonly root: HTMLElement) {}

  show(profiles: PublicPlayerProfile[], callbacks: RankingMenuCallbacks, language: LanguageCode): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel ranking-panel">
        <h2>${t(language, 'ranking')}</h2>
        <div class="ranking-filter-row">
          ${FILTERS.map((filter) => `<button class="${filter === this.activeFilter ? 'active' : ''}" data-ranking-filter="${filter}" type="button">${this.filterLabel(filter, language)}</button>`).join('')}
        </div>
        <div class="ranking-list"></div>
        <div class="ranking-pagination"></div>
        <div class="button-grid">
          <button class="primary back" type="button">${t(language, 'back')}</button>
        </div>
      </section>
    `;
    const render = (): void => {
      const list = element.querySelector<HTMLElement>('.ranking-list');
      if (!list) return;
      const sorted = [...profiles]
        .sort((a, b) => this.filterValue(b, this.activeFilter) - this.filterValue(a, this.activeFilter));
      const totalPages = Math.max(1, Math.ceil(sorted.length / this.pageSize));
      this.page = Math.min(this.page, totalPages - 1);
      const offset = this.page * this.pageSize;
      const rows = sorted
        .slice(offset, offset + this.pageSize)
        .map((profile, index) => `
          <div class="ranking-row">
            <span>${offset + index + 1}</span>
            ${profile.avatarDataUrl ? `<img src="${this.escapeHtml(profile.avatarDataUrl)}" alt="" />` : `<div class="avatar-placeholder small">${this.escapeHtml(profile.username.slice(0, 2).toUpperCase())}</div>`}
            <button class="ranking-profile-link" data-profile-id="${this.escapeHtml(profile.accountId)}" type="button" title="${t(language, 'viewProfile')}">${this.escapeHtml(profile.username)}</button>
            <span>${this.filterValue(profile, this.activeFilter)}</span>
          </div>
        `)
        .join('');
      list.innerHTML = rows || `<p class="subtitle">${t(language, 'waitingForPlayer')}</p>`;
      const pagination = element.querySelector<HTMLElement>('.ranking-pagination');
      if (pagination) {
        pagination.innerHTML = `
          <div class="ranking-page-size" aria-label="${t(language, 'rowsPerPage')}">
            <span>${t(language, 'rowsPerPage')}</span>
            <button class="${this.pageSize === 50 ? 'active' : ''}" data-page-size="50" type="button">50</button>
            <button class="${this.pageSize === 100 ? 'active' : ''}" data-page-size="100" type="button">100</button>
          </div>
          <div class="ranking-page-controls">
            <button data-page-action="prev" type="button" ${this.page <= 0 ? 'disabled' : ''}>${t(language, 'previousPage')}</button>
            <span>${t(language, 'rankingPageLabel')} ${this.page + 1}/${totalPages}</span>
            <button data-page-action="next" type="button" ${this.page >= totalPages - 1 ? 'disabled' : ''}>${t(language, 'nextPage')}</button>
          </div>
        `;
      }
      element.querySelectorAll<HTMLButtonElement>('[data-profile-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const accountId = button.dataset.profileId;
          if (accountId) {
            callbacks.onOpenProfile(accountId);
          }
        });
      });
      element.querySelectorAll<HTMLButtonElement>('[data-page-size]').forEach((button) => {
        button.addEventListener('click', () => {
          this.pageSize = Number(button.dataset.pageSize) === 100 ? 100 : 50;
          this.page = 0;
          render();
        });
      });
      element.querySelectorAll<HTMLButtonElement>('[data-page-action]').forEach((button) => {
        button.addEventListener('click', () => {
          this.page += button.dataset.pageAction === 'next' ? 1 : -1;
          render();
        });
      });
    };
    element.querySelectorAll<HTMLButtonElement>('[data-ranking-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        this.activeFilter = button.dataset.rankingFilter as RankingFilter;
        this.page = 0;
        element.querySelectorAll('[data-ranking-filter]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        render();
      });
    });
    element.querySelector('.back')?.addEventListener('click', callbacks.onBack);
    this.root.appendChild(element);
    this.element = element;
    render();
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private filterLabel(filter: RankingFilter, language: LanguageCode): string {
    switch (filter) {
      case 'matches':
        return t(language, 'rankingMostMatches');
      case 'kills':
        return t(language, 'rankingMostKills');
      case 'wins':
        return t(language, 'rankingMostWins');
      case 'timedWins':
        return t(language, 'rankingTimedWins');
      case 'lastHoleStandingWins':
        return t(language, 'rankingLastHoleWins');
      case 'eliminationRushWins':
        return t(language, 'rankingEliminationWins');
      case 'timeTrialWins':
        return t(language, 'rankingTimeTrialWins');
      case 'careerWins':
        return t(language, 'rankingCareerWins');
      case 'bestScore':
      default:
        return t(language, 'bestScoreRanking');
    }
  }

  private filterValue(profile: PublicPlayerProfile, filter: RankingFilter): number {
    switch (filter) {
      case 'matches':
        return profile.stats.matchesPlayed;
      case 'kills':
        return profile.stats.totalEliminations;
      case 'wins':
        return profile.stats.wins;
      case 'timedWins':
        return profile.stats.timedWins;
      case 'lastHoleStandingWins':
        return profile.stats.lastHoleStandingWins;
      case 'eliminationRushWins':
        return profile.stats.eliminationRushWins;
      case 'timeTrialWins':
        return profile.stats.timeTrialWins;
      case 'careerWins':
        return profile.stats.careerWins;
      case 'bestScore':
      default:
        return profile.stats.bestScore;
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
