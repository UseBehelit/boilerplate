import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

export const PRO_ENTITLEMENT_ID = 'pro';

const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  default: undefined,
});

let configured = false;

export function isPurchasesConfigured() {
  return configured;
}

export function configurePurchases(appUserId?: string) {
  if (configured) return;
  if (!REVENUECAT_API_KEY) {
    console.warn(
      'RevenueCat API key missing — set EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY before using purchases/paywall.',
    );
    return;
  }
  Purchases.configure({ apiKey: REVENUECAT_API_KEY, appUserID: appUserId });
  configured = true;
}

export async function fetchIsPro() {
  if (!configured) return false;
  const info = await Purchases.getCustomerInfo();
  return typeof info.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
}
