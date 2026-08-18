import { defaultLocale, resources, type Locale, type TranslationKey } from './resources';

function getByPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const value = getByPath(resources[locale], key) ?? getByPath(resources[defaultLocale], key);

  if (typeof value !== 'string') {
    if (__DEV__) console.warn(`[i18n] Missing translation for key "${key}"`);
    return key;
  }

  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
