import { Image as RNImage } from 'expo-image';
import React from 'react';
import { useCssElement } from 'react-native-css';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);

function CSSImage(props: React.ComponentProps<typeof AnimatedExpoImage>) {
  // @ts-expect-error: objectFit/objectPosition are CSS-style props remapped to expo-image's contentFit/contentPosition
  const { objectFit, objectPosition, ...style } = StyleSheet.flatten(props.style) || {};

  return (
    <AnimatedExpoImage
      contentFit={objectFit}
      contentPosition={objectPosition}
      {...props}
      source={typeof props.source === 'string' ? { uri: props.source } : props.source}
      // @ts-expect-error: style is remapped above
      style={style}
    />
  );
}

export const Image = (props: React.ComponentProps<typeof CSSImage> & { className?: string }) => {
  // `as any` keeps TS from recursing into expo-image's large prop union — see src/tw/index.tsx.
  return useCssElement(CSSImage as any, props, { className: 'style' });
};
Image.displayName = 'CSS(Image)';
