# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## What this repo is

This is `com.behelit.boilerplate` — a reusable Expo starting point, not a single product. It gets cloned per app and then customized. Keep additions generic (patterns worth reusing across many future apps) rather than app-specific. The bundle identifier / package name (`com.behelit.boilerplate` in `app.json`) and the name/slug (`boilerplate`) are the first things a clone should change — `npm run configure` does this (see Commands).

The app ships with a demo onboarding → auth → tabbed-app → paywall flow (see Architecture below) meant as reference patterns to gut and replace, not a real product.

## Commands

- `npm start` (or `npx expo start`) — start the dev server; press `i`/`a`/`w` to open iOS/Android/web, or scan the QR code with Expo Go.
- `npm run ios` / `npm run android` / `npm run web` — start the dev server targeting a specific platform directly.
- `npm run lint` (`expo lint`) — ESLint via `eslint-config-expo` (flat config in `eslint.config.js`).
- `npx tsc --noEmit` — typecheck. Run `npx expo start` at least once first (or after adding/removing a route file, or a `.css`/asset import) so `expo-env.d.ts`, `nativewind-env.d.ts`, and Router's typed-route types exist and are current.
- `npm run configure` — interactive wizard (`scripts/configure-app.js`) to rebrand a fresh clone: display name, slug (url scheme + `package.json` name), iOS bundle identifier / Android package name, and the app icon. Also available as single-purpose, scriptable commands — `npm run set:name -- "My App"`, `set:app-id -- com.you.app` (both platforms at once), `set:bundle-id` / `set:package-name -- com.you.app` (separately, for the rare case they diverge), `set:icon -- ./path/to/icon.png` (note the `--`, so npm forwards the value). Setting a new icon drops `expo.ios.icon` (Apple's Icon Composer bundle at `assets/expo.icon/`, which can't be regenerated from a flat image) and falls back to the flat PNG on all platforms — see the script's own output for what to do if you want that bundle back. None of this touches `/ios` or `/android` — run `npx expo prebuild --clean` (or just don't prebuild yet) for native projects to pick the changes up.
- `npm run reset-project` — one-way scaffold reset: moves `src/` and `scripts/` into `example/` (or deletes them) and regenerates a blank `src/app/index.tsx` + `_layout.tsx`. This throws away the onboarding/auth/tabs/paywall flow entirely — only run it if you want a truly blank slate instead of gutting the existing flow.
- No test runner is configured yet (`package.json` has no `test` script). If you add tests, wire them up via `npx expo install -- --dev jest jest-expo` per Expo's unit-testing guide and colocate `*.test.ts(x)` next to the file under test.
- No `eas.json` yet — add one (`eas build:configure`) before using EAS Build/Submit/Update.

## Architecture

Expo Router (`expo-router`) with the app tree under `src/app/` (not the repo-root `app/`), aliased as `@/*` → `./src/*` and `@/assets/*` → `./assets/*` in `tsconfig.json`. Typed routes are on (`experiments.typedRoutes` in `app.json`), as is the React Compiler (`experiments.reactCompiler`).

### Route gating (onboarding → auth → app)

`src/app/_layout.tsx` renders one root `<Stack>` with three mutually-exclusive `Stack.Protected` branches, gated by `hasCompletedOnboarding` (`stores/onboarding-store.ts`) and `isAuthenticated` (`stores/auth-store.ts`):

- `onboarding` (`src/app/onboarding.tsx`) — shown until onboarding is completed.
- `(auth)` (`src/app/(auth)/`) — `login.tsx` + `register.tsx`, shown once onboarded but not authenticated.
- `(tabs)` (`src/app/(tabs)/`) — the main app, shown once onboarded and authenticated.

`src/app/index.tsx` is the only screen mapped to `/` — it does nothing but `<Redirect>` to whichever of the three is correct. This exists so the *initial* route is deterministic instead of relying on `Stack.Protected`'s implicit fallback; `Stack.Protected` itself still guards against deep-linking or navigating back into a screen whose guard has since flipped false (e.g. after sign-out). The tabs' home screen is named `home.tsx`, not `index.tsx` — inside the `(tabs)` route group `index.tsx` would resolve to bare `/` and collide with the top-level redirect.

Both stores read their initial state synchronously from MMKV (see below) at module scope — correct on native, but MMKV's web shim throws during SSR (`expo-router`'s web output is static-rendered), so that read is guarded by `canReadStorageSync()` in `src/lib/mmkv.ts`.

### `(tabs)` — the main app

`src/components/app-tabs.tsx` (+ `.web.tsx` variant) is the `(tabs)` group's `_layout.tsx`, built on `expo-router/unstable-native-tabs` (native tab bar APIs, still unstable — check versioned docs before extending) with four tabs: Home, Marketplace, Settings, Profile, icons via `NativeTabs.Trigger.VectorIcon` (`@expo/vector-icons`, no custom PNGs needed).

- **Home** (`screens/home`) — React Query demo (`lib/demo-data.ts`) rendering stat cards, plus a `@gorhom/bottom-sheet` detail view.
- **Marketplace** (`app/(tabs)/marketplace/`) — its own nested `Stack`: `index.tsx` (list) → `[id].tsx` (detail), backed by the same demo data.
- **Profile** (`screens/profile`) — shows the RevenueCat entitlement (`hooks/use-entitlement.ts`) and links to `/paywall`.
- **Settings** (`screens/settings`) — appearance and language pickers (see below), notification permission (`expo-notifications`), app version (`expo-constants`), sign-out.

`/paywall` (`src/app/paywall.tsx`, presented as a modal) renders RevenueCat's `RevenueCatUI.Paywall`, with a fallback screen when `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` aren't set (`lib/purchases.ts`).

### Auth and storage — replace before shipping

`stores/auth-store.ts` and the login/register screens are **stubbed** — `fakeAuthRequest` in the store simulates a network call with no real backend. Swap it for a real API client; the store's shape (`user`, `isAuthenticated`, `login`/`register`/`logout`, MMKV persistence) is meant to be reusable, the request itself is not. `lib/mmkv.ts` wraps `react-native-mmkv` v4's `createMMKV()` factory API (not the old `new MMKV()` class, and `remove()` not `delete()` — the API changed between major versions).

### Theme (light/dark)

`stores/theme-store.ts` holds a `system | light | dark` preference, MMKV-persisted like the onboarding/auth stores. It's folded into the template's own `src/hooks/use-color-scheme.ts` (+ `.web.ts`) abstraction rather than living beside it — that hook always resolves to a plain `'light' | 'dark'` now (no more `=== 'unspecified'` guards at each call site), and everything that already read it (`_layout.tsx`'s `ThemeProvider`, `app-tabs.tsx`'s `NativeTabs` colors, `use-theme.ts` → `themed-text`/`themed-view`) picks up the override for free.

That hook doesn't reach Tailwind's `dark:` classes, though — `react-native-css` tracks OS Appearance on its own via a module-level listener, independent of app state, and will silently win a race against a forced preference if the OS theme changes mid-session. `components/theme-sync.tsx` (mounted once in the root layout) pushes the resolved scheme into `react-native-css`'s `colorScheme.set()` (wrapped in `lib/color-scheme.ts`) and re-registers its own `Appearance` listener whenever a preference is forced, specifically to win that race by re-asserting after `react-native-css`'s listener fires. Don't call `colorScheme.set()` from anywhere else — there is exactly one place that owns this sync.

### Internationalization (i18n)

`src/i18n/` is a small dependency-free translation layer — no i18next. `resources.ts` registers locale JSON files from `i18n/locales/` (currently just `en.json`) and derives a `TranslationKey` union type from `en.json`'s shape via a recursive dotted-path type, so `t('some.wrong.key')` is a compile error. `translate.ts` does the actual lookup + `{{param}}` interpolation, falling back to `en` (then the raw key) if a locale is missing a string.

`stores/locale-store.ts` holds a `system | <locale>` preference (MMKV-persisted, same pattern as theme). `hooks/use-locale.ts` resolves it against the device's locales (`expo-localization`'s `useLocales()`, which is SSR-safe — unlike MMKV's web shim, it never throws server-side) to a concrete `Locale`. `hooks/use-translation.ts` wraps that into `const { t } = useTranslation()` for use in components.

**Only `en` is translated, by design.** Every user-facing string in the app already goes through `t()` — Settings even has a working language picker — but it only offers "System" and "English" until a second `locales/<code>.json` file is added. To add one: copy `en.json`'s shape, translate the values, register it in `resources.ts`'s `resources` object, and add a row to `languageOptions` in `screens/settings/index.tsx`. Demo/mock content (`lib/demo-data.ts`'s marketplace items, `auth-store.ts`'s stubbed error messages) is deliberately **not** run through `t()` — it stands in for backend-sourced content, which in a real app would carry its own localization strategy, not the client-side static-string one.

### Styling

NativeWind v5 (preview) + Tailwind v4 + `react-native-css`, **not** the classic NativeWind v4/Babel-preset setup. `metro.config.js` wraps the Metro config with `withNativewind`; `postcss.config.mjs` + `src/global.css` (imported transitively via `src/constants/theme.ts`, which also still needs the `--font-display` etc. CSS vars defined there) do the Tailwind v4 processing. Because `react-native-css` requires explicit className-aware wrapping (no global polyfill), use the components from `src/tw/` (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `Link`, `AnimatedScrollView`, plus `Image` in `src/tw/image.tsx`) instead of importing directly from `react-native`/`expo-router`/`expo-image` when you want `className` support. A few of those wrappers cast their component argument to `any` before calling `useCssElement` — the real prop types (`Link`'s `Href` union, `ScrollView`'s extra mapping keys, `Pressable`'s style-callback overloads) push TypeScript's generic inference past its recursion limit otherwise.

`react-native-css@^3.0.7` + `nativewind@5.0.0-preview.4` is a **deliberately different pin** from the versions in Expo's `expo-tailwind-setup` skill/docs — that guide's pinned nightly `react-native-css` build has a hard `peerDependency` on `expo@54.0.0-preview.6`, which conflicts with this project's SDK 57. Check `npm view nativewind versions` / `npm view react-native-css peerDependencies` before bumping either package, since a stale nightly pin will `ERESOLVE`-fail the install.

The template's original components (`themed-text.tsx`, `themed-view.tsx`, `external-link.tsx`) still exist and are still used by `app-tabs.web.tsx`'s custom web tab bar — they're the older `StyleSheet.create` + `Colors`-constant pattern from `src/constants/theme.ts`, kept where they were already wired up rather than converted.

### Everything else

- `src/components/` — shared UI. Platform-specific files follow the `.ios`/`.android`/`.web` suffix convention — Metro picks the match per platform, and every platform-specific component needs a default (extensionless) file.
- `src/components/ui/` — Tailwind-based primitives (`Screen`, `Button`, `TextField`, `Card`, `Avatar`, `Badge`, `ListRow`, `ListSection`, `EmptyState`) used by the newer screens. Promote a new one here once a pattern repeats across screens — see the `expo-design-system` skill for the extraction criteria.
- `src/constants/theme.ts` — design tokens: `Colors` (light/dark), `Spacing`, layout constants like `MaxContentWidth`/`BottomTabInset`.
- `src/hooks/` — `use-color-scheme.ts` (native) and `.web.ts` variant (guards against SSR/hydration mismatch by delaying the real scheme until after mount — this is intentional, not a bug, even though the lint rule `react-hooks/set-state-in-effect` currently flags it as a false positive) — see Theme above; `use-locale.ts` / `use-translation.ts` — see i18n above; `use-entitlement.ts` — RevenueCat entitlement via React Query.
- `src/lib/` — non-React helpers: `mmkv.ts`, `color-scheme.ts` (theme ↔ react-native-css sync), `query-client.ts` (React Query), `purchases.ts` (RevenueCat), `demo-data.ts` (fake fetchers — delete once real data sources exist).
- `src/stores/` — Zustand stores (`auth-store.ts`, `onboarding-store.ts`, `theme-store.ts`, `locale-store.ts`).
- `scripts/reset-project.js` — see `reset-project` command above.

Follow the `expo-project-structure` conventions as the codebase grows further: `screens/<name>/` for a screen's private sub-components, `server/` + `src/app/api/*+api.ts` if API routes are added, tests colocated next to source.
