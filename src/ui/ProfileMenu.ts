import { getMatchModeLabel } from '../game/MatchMode';
import { t } from '../i18n/I18n';
import { getVoidSkinDefinition } from '../player/VoidSkins';
import type { LanguageCode, MatchHistoryEntry, PlayerProfile, ProfileSocialKind, ProfileSocialLink, PublicPlayerProfile, VoidSkinId } from '../shared/types';

type ProfileViewData = PublicPlayerProfile & { matchHistory?: MatchHistoryEntry[] };

export interface ProfileCustomizationInput {
  profileTitle: string;
  bio: string;
  profileAccentColor: string;
  holeRimColor: string;
  socialLinks: ProfileSocialLink[];
  selectedVoidSkin: VoidSkinId;
}

export interface ProfileMenuCallbacks {
  onBack: () => void;
  onAvatarChange?: (avatarDataUrl: string) => void;
  onProfileUpdate?: (input: ProfileCustomizationInput) => void;
}

const SOCIAL_KINDS: ProfileSocialKind[] = ['website', 'instagram', 'youtube', 'tiktok', 'discord'];

export class ProfileMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(profile: ProfileViewData, callbacks: ProfileMenuCallbacks, language: LanguageCode, options: { editable?: boolean } = {}): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    const editable = options.editable !== false;
    const stats = profile.stats;
    const experience = profile.experience;
    const selectedSkin = getVoidSkinDefinition(profile.selectedVoidSkin);
    const history = (profile.matchHistory ?? [])
      .slice(0, 10)
      .map((entry) => `
        <div class="history-row profile-history-row">
          <span>${this.escapeHtml(new Date(entry.playedAt).toLocaleDateString())}</span>
          <strong>${this.escapeHtml(getMatchModeLabel(entry.matchMode))}</strong>
          <span>${entry.finalScore} ${t(language, 'pts')}</span>
          <span>${entry.eliminations} K</span>
        </div>
      `)
      .join('');

    element.innerHTML = `
      <section class="menu-panel profile-panel" style="--profile-accent: ${this.escapeHtml(profile.profileAccentColor)}">
        <div class="profile-header enhanced">
          ${profile.avatarDataUrl ? `<img class="profile-avatar" src="${this.escapeHtml(profile.avatarDataUrl)}" alt="" />` : `<div class="profile-avatar avatar-placeholder">${this.escapeHtml(profile.username.slice(0, 2).toUpperCase())}</div>`}
          <div class="profile-identity">
            <span class="profile-level-chip">${t(language, 'level')} ${experience.level}</span>
            <h2>${this.escapeHtml(profile.username)}</h2>
            <p class="subtitle">${this.escapeHtml(profile.profileTitle || `@${profile.playerName}`)}</p>
          </div>
        </div>

        <div class="profile-xp-card">
          <div>
            <span>${t(language, 'totalXp')}</span>
            <strong>${experience.totalXp}</strong>
          </div>
          <div class="profile-xp-progress" aria-label="${t(language, 'xpToNextLevel')}">
            <i style="width: ${Math.round(experience.progress * 100)}%"></i>
          </div>
          <span>${experience.currentLevelXp}/${experience.nextLevelXp} ${t(language, 'xpToNextLevel')}</span>
        </div>

        <div class="profile-bio-card">
          <h3>${t(language, 'profileBio')}</h3>
          <p>${this.escapeHtml(profile.bio || (editable ? t(language, 'profileBioEmptyOwn') : t(language, 'profileBioEmpty')))}</p>
          ${this.renderSocialLinks(profile.socialLinks, language)}
        </div>

        ${editable ? this.renderCustomizationForm(profile, language) : ''}

        <h3>${t(language, 'profileStats')}</h3>
        <div class="profile-stats-grid">
          ${this.stat(t(language, 'totalMatches'), stats.matchesPlayed)}
          ${this.stat(t(language, 'totalWins'), stats.wins)}
          ${this.stat(t(language, 'bestScoreRanking'), stats.bestScore)}
          ${this.stat(t(language, 'totalKills'), stats.totalEliminations)}
          ${this.stat(t(language, 'totalObjects'), stats.totalObjectsSwallowed)}
          ${this.stat(t(language, 'rankingTimedWins'), stats.timedWins)}
          ${this.stat(t(language, 'rankingLastHoleWins'), stats.lastHoleStandingWins)}
          ${this.stat(t(language, 'rankingEliminationWins'), stats.eliminationRushWins)}
          ${this.stat(t(language, 'rankingTimeTrialWins'), stats.timeTrialWins)}
          ${this.stat(t(language, 'rankingCareerWins'), stats.careerWins)}
        </div>

        <h3>${t(language, 'voidSkins')}</h3>
        <div class="void-skin-grid">
          ${profile.ownedVoidSkins.map((skinId) => this.renderSkinCard(skinId, skinId === selectedSkin.id, editable, language)).join('')}
        </div>

        ${history ? `<h3>${t(language, 'matchHistory')}</h3><div class="history-list">${history}</div>` : ''}
        <div class="button-grid">
          <button class="primary back" type="button">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    const avatarInput = element.querySelector<HTMLInputElement>('.avatar-input');
    avatarInput?.addEventListener('change', () => {
      const file = avatarInput.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && callbacks.onAvatarChange) {
          callbacks.onAvatarChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    element.querySelectorAll<HTMLButtonElement>('[data-skin-id]').forEach((button) => {
      button.addEventListener('click', () => {
        element.querySelectorAll('.void-skin-card').forEach((card) => card.classList.remove('selected'));
        button.classList.add('selected');
      });
    });

    element.querySelector<HTMLButtonElement>('.save-profile')?.addEventListener('click', () => {
      callbacks.onProfileUpdate?.(this.collectCustomization(element, profile));
    });
    element.querySelector('.back')?.addEventListener('click', callbacks.onBack);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private renderCustomizationForm(profile: ProfileViewData, language: LanguageCode): string {
    return `
      <div class="profile-edit-panel">
        <h3>${t(language, 'profileCustomization')}</h3>
        <label class="field">
          ${t(language, 'profileTitleLabel')}
          <input class="profile-title-input" maxlength="42" value="${this.escapeHtml(profile.profileTitle ?? '')}" />
        </label>
        <label class="field">
          ${t(language, 'profileBio')}
          <textarea class="profile-bio-input" maxlength="220">${this.escapeHtml(profile.bio ?? '')}</textarea>
        </label>
        <div class="profile-color-row">
          <label class="field">
            ${t(language, 'profileAccentColor')}
            <input class="profile-accent-input" type="color" value="${this.escapeHtml(profile.profileAccentColor)}" />
          </label>
          <label class="field">
            ${t(language, 'voidRimColor')}
            <input class="profile-rim-input" type="color" value="${this.escapeHtml(profile.holeRimColor)}" />
          </label>
        </div>
        <label class="field">
          ${t(language, 'uploadPhoto')}
          <input class="avatar-input" type="file" accept="image/*" />
        </label>
        <h3>${t(language, 'socialLinks')}</h3>
        <div class="profile-social-edit">
          ${SOCIAL_KINDS.map((kind) => {
            const existing = profile.socialLinks.find((link) => link.kind === kind);
            return `
              <label class="field">
                ${this.socialLabel(kind, language)}
                <input data-social-kind="${kind}" value="${this.escapeHtml(existing?.url ?? '')}" placeholder="https://" />
              </label>
            `;
          }).join('')}
        </div>
        <button class="primary save-profile" type="button">${t(language, 'saveProfile')}</button>
      </div>
    `;
  }

  private renderSocialLinks(links: ProfileSocialLink[], language: LanguageCode): string {
    if (links.length === 0) {
      return `<p class="subtitle">${t(language, 'socialLinksEmpty')}</p>`;
    }
    return `
      <div class="profile-social-links">
        ${links.map((link) => `
          <a href="${this.escapeHtml(link.url)}" target="_blank" rel="noreferrer">${this.escapeHtml(link.label)}</a>
        `).join('')}
      </div>
    `;
  }

  private renderSkinCard(skinId: VoidSkinId, selected: boolean, editable: boolean, language: LanguageCode): string {
    const skin = getVoidSkinDefinition(skinId);
    const tag = editable ? 'button' : 'div';
    const data = editable ? `data-skin-id="${skin.id}" type="button"` : '';
    return `
      <${tag} class="void-skin-card ${selected ? 'selected' : ''}" ${data} style="--skin-accent: ${this.escapeHtml(skin.accentColor)}">
        <span class="void-skin-orb"></span>
        <strong>${this.escapeHtml(skin.name)}</strong>
        <em>${this.escapeHtml(skin.rarity)}</em>
        <p>${this.escapeHtml(skin.description)}</p>
        <small>${t(language, 'skinPower')}: ${this.escapeHtml(skin.powerName)}</small>
        <small>${this.escapeHtml(skin.powerDescription)}</small>
        ${selected ? `<b>${t(language, 'selected')}</b>` : ''}
      </${tag}>
    `;
  }

  private collectCustomization(element: HTMLElement, profile: ProfileViewData): ProfileCustomizationInput {
    const socialLinks = SOCIAL_KINDS
      .map((kind) => {
        const input = element.querySelector<HTMLInputElement>(`[data-social-kind="${kind}"]`);
        const url = input?.value.trim() ?? '';
        if (!url) {
          return null;
        }
        return {
          kind,
          label: this.socialLabel(kind, 'en' as LanguageCode),
          url
        };
      })
      .filter((link): link is ProfileSocialLink => Boolean(link));
    const selectedSkin = element.querySelector<HTMLElement>('.void-skin-card.selected')?.dataset.skinId as VoidSkinId | undefined;
    return {
      profileTitle: element.querySelector<HTMLInputElement>('.profile-title-input')?.value ?? '',
      bio: element.querySelector<HTMLTextAreaElement>('.profile-bio-input')?.value ?? '',
      profileAccentColor: element.querySelector<HTMLInputElement>('.profile-accent-input')?.value ?? profile.profileAccentColor,
      holeRimColor: element.querySelector<HTMLInputElement>('.profile-rim-input')?.value ?? profile.holeRimColor,
      socialLinks,
      selectedVoidSkin: selectedSkin ?? profile.selectedVoidSkin
    };
  }

  private socialLabel(kind: ProfileSocialKind, language: LanguageCode): string {
    switch (kind) {
      case 'instagram':
        return t(language, 'socialInstagram');
      case 'youtube':
        return t(language, 'socialYoutube');
      case 'tiktok':
        return t(language, 'socialTiktok');
      case 'discord':
        return t(language, 'socialDiscord');
      case 'website':
      default:
        return t(language, 'socialWebsite');
    }
  }

  private stat(label: string, value: number): string {
    return `<div class="profile-stat"><span>${this.escapeHtml(label)}</span><strong>${value}</strong></div>`;
  }

  private escapeHtml(value: string | number): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
