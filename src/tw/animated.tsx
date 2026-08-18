import RNAnimated from 'react-native-reanimated';

import * as TW from '@/tw';

export const Animated = {
  ...RNAnimated,
  View: RNAnimated.createAnimatedComponent(TW.View),
};
