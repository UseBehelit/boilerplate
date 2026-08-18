#!/usr/bin/env node

/**
 * Rebrand this cloned boilerplate: app display name, slug (url scheme +
 * package.json name), iOS bundle identifier / Android package name, and
 * the app icon.
 *
 * Interactive wizard:
 *   node scripts/configure-app.js
 *
 * Non-interactive flags (any subset), useful for scripting/CI:
 *   node scripts/configure-app.js --name "My App"
 *   node scripts/configure-app.js --slug my-app
 *   node scripts/configure-app.js --app-id com.mycompany.myapp
 *   node scripts/configure-app.js --bundle-id com.mycompany.myapp
 *   node scripts/configure-app.js --package-name com.mycompany.myapp
 *   node scripts/configure-app.js --icon ./path/to/icon.png
 *
 * Via npm, remember the "--" so npm forwards the flag to this script:
 *   npm run configure
 *   npm run set:name -- "My App"
 *   npm run set:app-id -- com.mycompany.myapp
 *   npm run set:bundle-id -- com.mycompany.myapp
 *   npm run set:package-name -- com.mycompany.myapp
 *   npm run set:icon -- ./path/to/icon.png
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const appJsonPath = path.join(root, "app.json");
const packageJsonPath = path.join(root, "package.json");

const APP_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ICON_EXTENSIONS = [".png", ".jpg", ".jpeg"];

const HELP = `Configure this boilerplate's identity (name, slug, bundle id / package name, icon).

Usage:
  node scripts/configure-app.js                              Interactive wizard
  node scripts/configure-app.js --name "My App"               Set the display name
  node scripts/configure-app.js --slug my-app                 Set slug + url scheme + package.json name
  node scripts/configure-app.js --app-id com.mycompany.myapp  Set iOS bundle id AND Android package together
  node scripts/configure-app.js --bundle-id com.mycompany.myapp    Set iOS bundle identifier only
  node scripts/configure-app.js --package-name com.mycompany.myapp  Set Android package name only
  node scripts/configure-app.js --icon ./path/to/icon.png     Replace the app icon

Via npm, remember the "--" so npm forwards the value to this script:
  npm run configure
  npm run set:name -- "My App"
  npm run set:app-id -- com.mycompany.myapp
  npm run set:bundle-id -- com.mycompany.myapp
  npm run set:package-name -- com.mycompany.myapp
  npm run set:icon -- ./path/to/icon.png
`;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function assertAppId(value, label) {
  if (!APP_ID_PATTERN.test(value)) {
    throw new Error(
      `${label} must look like reverse-DNS, e.g. com.mycompany.myapp (got "${value}")`
    );
  }
}

function assertSlug(value) {
  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      `Slug must be lowercase, alphanumeric, hyphen-separated, e.g. my-app (got "${value}")`
    );
  }
}

function setName(appJson, name) {
  if (!name.trim()) throw new Error("Name can't be empty.");
  appJson.expo.name = name;
}

function setSlug(appJson, packageJson, slug) {
  assertSlug(slug);
  appJson.expo.slug = slug;
  appJson.expo.scheme = slug;
  packageJson.name = slug;
}

function setBundleId(appJson, id) {
  assertAppId(id, "iOS bundle identifier");
  appJson.expo.ios = appJson.expo.ios || {};
  appJson.expo.ios.bundleIdentifier = id;
}

function setPackageName(appJson, id) {
  assertAppId(id, "Android package name");
  appJson.expo.android = appJson.expo.android || {};
  appJson.expo.android.package = id;
}

function setIcon(appJson, sourcePath) {
  const resolved = path.resolve(root, sourcePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Icon file not found: ${resolved}`);
  }
  const ext = path.extname(resolved).toLowerCase();
  if (!ICON_EXTENSIONS.includes(ext)) {
    throw new Error(`Icon must be a ${ICON_EXTENSIONS.join("/")} file (got "${ext}")`);
  }

  const targets = [
    "assets/images/icon.png",
    "assets/images/favicon.png",
    "assets/images/android-icon-foreground.png",
  ];
  for (const target of targets) {
    fs.copyFileSync(resolved, path.join(root, target));
  }

  // expo.ios.icon points at assets/expo.icon/, Apple's Icon Composer bundle
  // format (layered, translucency, iOS 18+ adaptive icons) — it can't be
  // regenerated from a single flat image, so drop it and let iOS fall back
  // to the flat assets/images/icon.png like Android and web already do.
  let removedIconComposer = false;
  if (appJson.expo.ios && appJson.expo.ios.icon) {
    delete appJson.expo.ios.icon;
    removedIconComposer = true;
  }
  return removedIconComposer;
}

function createPrompter() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  // Plain sequential rl.question() calls silently drop answers past the first
  // when stdin is piped rather than a TTY (a long-standing Node readline
  // quirk — the interface stops delivering once the underlying stream ends,
  // even with buffered lines left). Consuming it as an async iterator instead
  // works reliably either way.
  const lines = rl[Symbol.asyncIterator]();
  return {
    ask: async (question) => {
      process.stdout.write(question);
      const { value, done } = await lines.next();
      return done ? "" : value;
    },
    close: () => rl.close(),
  };
}

async function askUntilValid(prompter, question, validate) {
  for (;;) {
    const answer = (await prompter.ask(question)).trim();
    if (!answer) return null; // blank = skip / keep current
    try {
      validate(answer);
      return answer;
    } catch (error) {
      console.log(`❌ ${error.message}`);
    }
  }
}

async function runInteractive(appJson, packageJson) {
  const prompter = createPrompter();
  const summary = [];

  try {
    const name = await askUntilValid(
      prompter,
      `App display name (current: "${appJson.expo.name}"): `,
      (value) => {
        if (!value.trim()) throw new Error("Name can't be empty.");
      }
    );
    if (name) {
      setName(appJson, name);
      summary.push(`name -> "${name}"`);
    }

    const slug = await askUntilValid(
      prompter,
      `Slug — url scheme + package.json name (current: "${appJson.expo.slug}"): `,
      assertSlug
    );
    if (slug) {
      setSlug(appJson, packageJson, slug);
      summary.push(`slug/scheme/package.json name -> "${slug}"`);
    }

    const currentAppId = appJson.expo.ios && appJson.expo.ios.bundleIdentifier;
    const appId = await askUntilValid(
      prompter,
      `App ID for both iOS bundle identifier and Android package name (current: "${currentAppId}"), press enter to set them separately instead: `,
      (value) => assertAppId(value, "App ID")
    );
    if (appId) {
      setBundleId(appJson, appId);
      setPackageName(appJson, appId);
      summary.push(`iOS bundle identifier + Android package name -> "${appId}"`);
    } else {
      const bundleId = await askUntilValid(
        prompter,
        `  iOS bundle identifier (current: "${currentAppId}", press enter to keep): `,
        (value) => assertAppId(value, "iOS bundle identifier")
      );
      if (bundleId) {
        setBundleId(appJson, bundleId);
        summary.push(`iOS bundle identifier -> "${bundleId}"`);
      }

      const currentPackage = appJson.expo.android && appJson.expo.android.package;
      const packageName = await askUntilValid(
        prompter,
        `  Android package name (current: "${currentPackage}", press enter to keep): `,
        (value) => assertAppId(value, "Android package name")
      );
      if (packageName) {
        setPackageName(appJson, packageName);
        summary.push(`Android package name -> "${packageName}"`);
      }
    }

    const iconPath = await prompter.ask(
      "Icon image path (PNG/JPG, press enter to skip): "
    );
    if (iconPath.trim()) {
      const removedIconComposer = setIcon(appJson, iconPath.trim());
      summary.push(`icon -> "${iconPath.trim()}"`);
      if (removedIconComposer) summary.push("removed expo.ios.icon (see note below)");
    }
  } finally {
    prompter.close();
  }

  return summary;
}

function runFromArgs(args, appJson, packageJson) {
  const summary = [];

  if (typeof args.name === "string") {
    setName(appJson, args.name);
    summary.push(`name -> "${args.name}"`);
  }
  if (typeof args.slug === "string") {
    setSlug(appJson, packageJson, args.slug);
    summary.push(`slug/scheme/package.json name -> "${args.slug}"`);
  }
  if (typeof args["app-id"] === "string") {
    setBundleId(appJson, args["app-id"]);
    setPackageName(appJson, args["app-id"]);
    summary.push(`iOS bundle identifier + Android package name -> "${args["app-id"]}"`);
  }
  if (typeof args["bundle-id"] === "string") {
    setBundleId(appJson, args["bundle-id"]);
    summary.push(`iOS bundle identifier -> "${args["bundle-id"]}"`);
  }
  if (typeof args["package-name"] === "string") {
    setPackageName(appJson, args["package-name"]);
    summary.push(`Android package name -> "${args["package-name"]}"`);
  }
  if (typeof args.icon === "string") {
    const removedIconComposer = setIcon(appJson, args.icon);
    summary.push(`icon -> "${args.icon}"`);
    if (removedIconComposer) summary.push("removed expo.ios.icon (see note below)");
  }

  return summary;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(HELP);
    return;
  }

  const appJson = readJson(appJsonPath);
  const packageJson = readJson(packageJsonPath);

  const hasFlags = ["name", "slug", "app-id", "bundle-id", "package-name", "icon"].some(
    (key) => typeof args[key] === "string"
  );

  let summary;
  try {
    summary = hasFlags
      ? runFromArgs(args, appJson, packageJson)
      : await runInteractive(appJson, packageJson);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (summary.length === 0) {
    console.log("Nothing changed.");
    return;
  }

  writeJson(appJsonPath, appJson);
  writeJson(packageJsonPath, packageJson);

  console.log("\n✅ Updated:");
  for (const line of summary) console.log(`  • ${line}`);

  console.log(
    "\nNext steps:" +
      "\n  • If /ios or /android already exist (you've run `expo prebuild`), delete them or run `npx expo prebuild --clean` so the native projects pick up these changes." +
      "\n  • Icon changes apply on the next build/prebuild — Expo resizes assets/images/icon.png per platform automatically."
  );
  if (summary.some((line) => line.includes("removed expo.ios.icon"))) {
    console.log(
      "  • iOS now uses the flat assets/images/icon.png like Android/web. assets/expo.icon/ (Apple's Icon Composer bundle, for iOS 18+ adaptive icons) is unused — delete it, or rebuild it yourself in Xcode's Icon Composer and re-add \"ios.icon\": \"./assets/expo.icon\" to app.json."
    );
  }
}

main();
