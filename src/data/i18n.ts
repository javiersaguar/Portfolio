import translations from './translations.json';
import * as content from './site';

export type Locale = 'en' | 'es' | 'zh';
export const locales: Locale[] = ['en', 'es', 'zh'];

export function getLocale(url: URL | string): Locale {
  const path = typeof url === 'string' ? new URL(url, 'https://portfolio.local').pathname : url.pathname;
  const candidate = path.split('/').filter(Boolean)[0];
  return candidate === 'es' || candidate === 'zh' ? candidate : 'en';
}

export function translate(locale: Locale, text: string): string {
  if (locale === 'en') return text;
  const key = text.trim().replace(/\s+/g, ' ');
  const pair = (translations as Record<string, string[]>)[key];
  return pair?.[locale === 'es' ? 0 : 1] ?? text;
}

// Traducir solo cadenas registradas conserva nombres propios, métricas y enlaces.
function localize<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return translate(locale, value) as T;
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item, locale)])) as T;
  return value;
}

export function getContent(locale: Locale) {
  return localize({ site: content.site, typedLines: content.typedLines, skillBars: content.skillBars, categories: content.categories, featured: content.featured, sideQuests: content.sideQuests, coursework: content.coursework, certifications: content.certifications, about: content.about, rightNow: content.rightNow, loot: content.loot, stack: content.stack }, locale);
}
