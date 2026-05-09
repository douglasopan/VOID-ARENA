import type { LANGUAGE_OPTIONS } from '../shared/constants';
import type { LanguageCode } from '../shared/types';

type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

const FLAG_URLS: Record<LanguageCode, string> = {
  en: new URL('../../flags/us.svg', import.meta.url).href,
  es: new URL('../../flags/es.svg', import.meta.url).href,
  pt: new URL('../../flags/br.svg', import.meta.url).href,
  fr: new URL('../../flags/fr.svg', import.meta.url).href,
  de: new URL('../../flags/DE.svg', import.meta.url).href,
  ru: new URL('../../flags/ru.svg', import.meta.url).href,
  ja: new URL('../../flags/jp.svg', import.meta.url).href,
  zh: new URL('../../flags/cn.svg', import.meta.url).href
};

export function languageFlagButtonMarkup(option: LanguageOption, language: LanguageCode): string {
  return `
    <button
      class="language-flag ${option.value === language ? 'active' : ''}"
      type="button"
      data-language="${option.value}"
      aria-label="${escapeHtml(option.label)}"
      title="${escapeHtml(option.label)}"
    >
      <span class="flag-icon" aria-hidden="true">
        <img class="flag-svg" src="${FLAG_URLS[option.value]}" alt="" loading="lazy" decoding="async" />
        <span class="flag-fallback">${option.short}</span>
      </span>
      <span>${option.short}</span>
    </button>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
