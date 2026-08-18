# Behelit Boilerplate

A reusable [Expo](https://expo.dev) starting point — not a single app. Use GitHub's **Use this template** button (or `npx create-expo-app --template <this-repo>`) to start a new project from it, then run the configure script below to rebrand it.

It ships with a working demo flow (onboarding → auth → tabbed app → paywall) built with Expo Router, NativeWind/Tailwind, Zustand, React Query, MMKV, and RevenueCat — meant as reference patterns to gut and replace, not a real product. See [`AGENTS.md`](./AGENTS.md) for the full architecture writeup (also used as project instructions for AI coding agents).

## Get started

```bash
npm install
npx expo start
```

Press `i` / `a` / `w` in the terminal to open iOS Simulator / Android Emulator / web, or scan the QR code with [Expo Go](https://expo.dev/go). App code lives under `src/`, routes under `src/app/` ([file-based routing](https://docs.expo.dev/router/introduction)).

## Configure a new clone

```bash
npm run configure
```

Interactive wizard for the app's display name, slug, iOS bundle identifier / Android package name, and icon. Each is also available as a standalone command for one-off changes or CI:

| Command | Sets |
| --- | --- |
| `npm run set:name -- "My App"` | Display name |
| `npm run set:app-id -- com.mycompany.myapp` | iOS bundle identifier **and** Android package name |
| `npm run set:bundle-id -- com.mycompany.myapp` | iOS bundle identifier only |
| `npm run set:package-name -- com.mycompany.myapp` | Android package name only |
| `npm run set:icon -- ./path/to/icon.png` | App icon (all platforms) |

(Note the `--` — it tells npm to forward the value to the script.) None of this touches `/ios` or `/android` — run `npx expo prebuild --clean` for native projects to pick the changes up.

## What's included

- **Flows** — onboarding (MMKV-persisted completion flag), stubbed email/password auth, a 4-tab app shell (Home, Marketplace, Settings, Profile), and a RevenueCat paywall — gated by `Stack.Protected` in `src/app/_layout.tsx`.
- **Styling** — NativeWind v5 + Tailwind v4 (`src/tw/`), with a small shared component kit in `src/components/ui/` (`Card`, `Avatar`, `Badge`, `ListRow`, `ListSection`, `EmptyState`, `Button`, `TextField`, `Screen`).
- **Theme** — system/light/dark, user-overridable from Settings, kept in sync across react-navigation, `NativeTabs`, and Tailwind's `dark:` classes.
- **i18n** — a small dependency-free translation layer (`src/i18n/`) with type-checked keys; only English is populated, ready for more locales.
- **State & data** — Zustand stores (`src/stores/`) persisted via `react-native-mmkv`, React Query for async data, a stubbed marketplace/dashboard data layer (`src/lib/demo-data.ts`) to replace with real endpoints.
- A wide set of Expo SDK modules pre-installed (camera, location, notifications, contacts, sqlite, haptics, and more) — see `package.json`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the dev server |
| `npm run ios` / `android` / `web` | Start the dev server for a specific platform |
| `npm run lint` | ESLint (`eslint-config-expo`) |
| `npm run configure` / `set:*` | Rebrand a cloned template — see above |
| `npm run reset-project` | One-way: move `src/`/`scripts/` aside and start from a blank `src/app/` |

No test runner is set up yet — see `AGENTS.md` for how to add one.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [NativeWind](https://www.nativewind.dev/)
