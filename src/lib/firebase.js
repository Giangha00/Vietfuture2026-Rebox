import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getFirebaseWebConfig, isFirebaseWebConfigured } from "@/lib/firebase-config";

export function getFirebaseApp() {
  if (!isFirebaseWebConfigured()) return null;
  if (getApps().length) return getApp();
  return initializeApp(getFirebaseWebConfig());
}

export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;
  if (!isFirebaseWebConfigured()) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;
  return getMessaging(app);
}
