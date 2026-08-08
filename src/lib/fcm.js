import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { isFirebaseWebConfigured } from "@/lib/firebase-config";
import {
  backendRegisterFcmToken,
  backendRemoveFcmToken,
} from "@/lib/rebox-backend-api";

const FCM_TOKEN_KEY = "rebox_fcm_token";

export function isPushConfigured() {
  return isFirebaseWebConfigured();
}

export async function registerFcmServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/firebase-messaging-sw.js", {
    scope: "/",
  });
}

export async function enablePushNotifications(authToken) {
  if (!authToken) throw new Error("You must be logged in.");
  if (!isFirebaseWebConfigured()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* keys to .env.local.",
    );
  }
  if (typeof window === "undefined" || !("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  // Once the user previously clicked Block, browsers won't show the prompt again.
  if (Notification.permission === "denied") {
    throw new Error(
      "Notifications are blocked for this site. Click the lock icon in the address bar → Site settings → Notifications → Allow, then reload.",
    );
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was denied. Allow notifications for localhost in the browser, then try again.",
    );
  }

  const registration = await registerFcmServiceWorker();
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }

  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration || undefined,
  });

  if (!fcmToken) {
    throw new Error("Could not get an FCM token.");
  }

  await backendRegisterFcmToken({ token: authToken, fcmToken });
  window.localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
  return fcmToken;
}

export async function syncPushTokenIfEnabled(authToken) {
  if (!authToken || !isFirebaseWebConfigured()) return null;
  if (typeof window === "undefined" || Notification.permission !== "granted") {
    return null;
  }

  try {
    const registration = await registerFcmServiceWorker();
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });

    if (!fcmToken) return null;
    await backendRegisterFcmToken({ token: authToken, fcmToken });
    window.localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
    return fcmToken;
  } catch {
    return null;
  }
}

export async function disablePushNotifications(authToken) {
  const fcmToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem(FCM_TOKEN_KEY)
      : null;

  if (authToken && fcmToken) {
    await backendRemoveFcmToken({ token: authToken, fcmToken });
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(FCM_TOKEN_KEY);
  }
}

export async function listenForForegroundMessages(onPayload) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    onPayload?.(payload);
  });
}
