export interface OnboardingSlide {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    key: 'welcome',
    title: 'Welcome',
    description: 'This is a boilerplate screen — swap the copy and art for your own product.',
    emoji: '👋',
  },
  {
    key: 'discover',
    title: 'Discover',
    description: 'Browse the marketplace tab to see a list/detail pattern you can reuse.',
    emoji: '🧭',
  },
  {
    key: 'ready',
    title: 'You’re set',
    description: 'Sign in or create an account to get started.',
    emoji: '🚀',
  },
];
