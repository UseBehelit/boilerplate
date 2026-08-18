# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## What this repo is

This is `com.behelit.boilerplate` — a reusable Expo starting point, not a single product. It gets cloned per app and then customized. Keep additions generic (patterns worth reusing across many future apps) rather than app-specific. The bundle identifier / package name (`com.behelit.boilerplate` in `app.json`) and the name/slug (`boilerplate`) are the first things a clone should change.

## Commands

- `npm start` (or `npx expo start`) — start the dev server; press `i`/`a`/`w` to open iOS/Android/web, or scan the QR code with Expo Go.
- `npm run ios` / `npm run android` / `npm run web` — start the dev server targeting a specific platform directly.
- `npm run lint` (`expo lint`) — ESLint via `eslint-config-expo` (flat config in `eslint.config.js`).
- `npx tsc --noEmit` — typecheck. Run `npx expo start` at least once first (or after adding a `.css`/asset import) so `expo-env.d.ts` and Router's typed-route types exist.
- `npm run reset-project` — one-way scaffold reset: moves `src/` and `scripts/` into `example/` (or deletes them) and regenerates a blank `src/app/index.tsx` + `_layout.tsx`. Meant for a fresh clone that's ready to become a real app; not something to run casually.
- No test runner is configured yet (`package.json` has no `test` script). If you add tests, wire them up via `npx expo install -- --dev jest jest-expo` per Expo's unit-testing guide and colocate `*.test.ts(x)` next to the file under test.
- No `eas.json` yet — add one (`eas build:configure`) before using EAS Build/Submit/Update.

## Architecture

Expo Router (`expo-router`) with the app tree under `src/app/` (not the repo-root `app/`), aliased as `@/*` → `./src/*` and `@/assets/*` → `./assets/*` in `tsconfig.json`. Typed routes are on (`experiments.typedRoutes` in `app.json`), as is the React Compiler (`experiments.reactCompiler`).

- `src/app/` — routes only. `_layout.tsx` wraps every screen in `ThemeProvider` (light/dark from `useColorScheme`) and renders `AppTabs`. Two tab screens exist: `index.tsx` (Home) and `explore.tsx`.
- `src/components/app-tabs.tsx` — the tab bar, built on `expo-router/unstable-native-tabs` (native tab bar APIs, still unstable — check versioned docs before extending). Reads colors from `src/constants/theme.ts`.
- `src/components/` — shared UI (`themed-text.tsx`, `themed-view.tsx` wrap RN primitives with the theme; `animated-icon.tsx` has a `.web.tsx` variant and a colocated `.module.css` for web-only styling). Platform-specific files follow the `.ios`/`.android`/`.web` suffix convention — Metro picks the match per platform, and every platform-specific component needs a default (extensionless) file.
- `src/constants/theme.ts` — design tokens: `Colors` (light/dark), `Spacing`, layout constants like `MaxContentWidth`/`BottomTabInset`. Styles are colocated at the bottom of each component file (`StyleSheet.create`), not in separate style files.
- `src/hooks/` — `use-color-scheme.ts` (native) and `.web.ts` variant (guards against SSR/hydration mismatch by delaying the real scheme until after mount — this is intentional, not a bug, even though the lint rule `react-hooks/set-state-in-effect` currently flags it as a false positive).
- `src/global.css` — web-only global stylesheet, imported for the `web-build`/`react-native-web` target.
- `scripts/reset-project.js` — see `reset-project` command above.

Follow the `expo-project-structure` conventions as the codebase grows: `screens/` for non-route screen bodies once a screen needs decomposing, `server/` + `src/app/api/*+api.ts` if API routes are added, hooks in `src/hooks/`, tests colocated next to source.
