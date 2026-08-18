import type { TranslationKey } from '@/i18n/resources';

export interface OnboardingSlide {
  key: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  emoji: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    key: 'welcome',
    titleKey: 'onboarding.slides.welcome.title',
    descriptionKey: 'onboarding.slides.welcome.description',
    emoji: '👋',
  },
  {
    key: 'discover',
    titleKey: 'onboarding.slides.discover.title',
    descriptionKey: 'onboarding.slides.discover.description',
    emoji: '🧭',
  },
  {
    key: 'ready',
    titleKey: 'onboarding.slides.ready.title',
    descriptionKey: 'onboarding.slides.ready.description',
    emoji: '🚀',
  },
];
