import { Link as RouterLink } from 'expo-router';
import React from 'react';
import { useCssElement, useNativeVariable as useFunctionalVariable } from 'react-native-css';
import Animated from 'react-native-reanimated';
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native';

// `as any` on these components keeps TS from recursing into their large generic prop
// types (Href unions, extra mapping keys) — react-native-css's useCssElement generic
// otherwise blows past TS's type-instantiation depth limit on this combination.
export const Link = (props: React.ComponentProps<typeof RouterLink> & { className?: string }) => {
  return useCssElement(RouterLink as any, props, { className: 'style' });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

export const useCSSVariable =
  process.env.EXPO_OS !== 'web' ? useFunctionalVariable : (variable: string) => `var(${variable})`;

export type ViewProps = React.ComponentProps<typeof RNView> & { className?: string };

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, { className: 'style' });
};
View.displayName = 'CSS(View)';

export type TextProps = React.ComponentProps<typeof RNText> & { className?: string };

export const Text = (props: TextProps) => {
  return useCssElement(RNText, props, { className: 'style' });
};
Text.displayName = 'CSS(Text)';

export type ScrollViewProps = React.ComponentProps<typeof RNScrollView> & {
  className?: string;
  contentContainerClassName?: string;
};

export const ScrollView = (props: ScrollViewProps) => {
  return useCssElement(RNScrollView as any, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
};
ScrollView.displayName = 'CSS(ScrollView)';

export type PressableProps = React.ComponentProps<typeof RNPressable> & { className?: string };

export const Pressable = (props: PressableProps) => {
  return useCssElement(RNPressable as any, props, { className: 'style' });
};
Pressable.displayName = 'CSS(Pressable)';

export type TextInputProps = React.ComponentProps<typeof RNTextInput> & { className?: string };

export const TextInput = (props: TextInputProps) => {
  return useCssElement(RNTextInput, props, { className: 'style' });
};
TextInput.displayName = 'CSS(TextInput)';

export type AnimatedScrollViewProps = React.ComponentProps<typeof Animated.ScrollView> & {
  className?: string;
  contentClassName?: string;
  contentContainerClassName?: string;
};

export const AnimatedScrollView = (props: AnimatedScrollViewProps) => {
  return useCssElement(Animated.ScrollView as any, props, {
    className: 'style',
    contentClassName: 'contentContainerStyle',
    contentContainerClassName: 'contentContainerStyle',
  });
};
AnimatedScrollView.displayName = 'CSS(AnimatedScrollView)';
