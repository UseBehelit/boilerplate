import en from './locales/en.json';

// Add a new locale by dropping a `locales/<code>.json` file with the same
// shape as en.json (mirror its keys — translate is only guaranteed to look
// them up, not to validate completeness) and registering it here.
export const resources = { en } as const;

export type Locale = keyof typeof resources;

export const defaultLocale: Locale = 'en';

export const supportedLocales = Object.keys(resources) as Locale[];

export function isSupportedLocale(code: string): code is Locale {
  return (supportedLocales as string[]).includes(code);
}

type DotPaths<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : T extends object
    ? { [K in keyof T & string]: DotPaths<T[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`> }[keyof T & string]
    : never;

export type TranslationKey = DotPaths<typeof en>;
