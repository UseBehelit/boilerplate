import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useTranslation } from '@/hooks/use-translation';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Text, View } from '@/tw';

import { onboardingSlides } from './slides';

const { width } = Dimensions.get('window');

export function Onboarding() {
  const router = useRouter();
  const { t } = useTranslation();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const isLastSlide = index === onboardingSlides.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (nextIndex !== index) setIndex(nextIndex);
  }

  function handleNext() {
    if (isLastSlide) {
      completeOnboarding();
      router.replace('/(auth)/login');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
  }

  return (
    <Screen>
      <FlatList
        ref={listRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide) => slide.key}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center gap-4 px-8">
            <Text className="text-6xl">{item.emoji}</Text>
            <Text className="text-center text-2xl font-bold text-neutral-900 dark:text-white">{t(item.titleKey)}</Text>
            <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
              {t(item.descriptionKey)}
            </Text>
          </View>
        )}
      />

      <View className="gap-4 px-8 pb-4">
        <View className="flex-row justify-center gap-2">
          {onboardingSlides.map((slide, slideIndex) => (
            <View
              key={slide.key}
              className={`h-2 w-2 rounded-full ${slideIndex === index ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
            />
          ))}
        </View>
        <Button label={isLastSlide ? t('onboarding.getStarted') : t('onboarding.next')} onPress={handleNext} />
        {!isLastSlide && (
          <Button
            label={t('onboarding.skip')}
            variant="ghost"
            onPress={() => {
              completeOnboarding();
              router.replace('/(auth)/login');
            }}
          />
        )}
      </View>
    </Screen>
  );
}
