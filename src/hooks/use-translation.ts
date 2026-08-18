import { useCallback } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { translate } from '@/i18n/translate';
import type { TranslationKey } from '@/i18n/resources';

export function useTranslation() {
  const locale = useLocale();

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  );

  return { t, locale };
}
