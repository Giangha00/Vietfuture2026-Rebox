import { getFirebaseWebConfig } from "@/lib/firebase-config";

export async function GET() {
  const config = getFirebaseWebConfig();

  const script = `
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(config)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "ReBox";
  const body = payload.notification?.body || payload.data?.body || "";
  const link = payload.data?.link || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.svg",
    data: { link },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification?.data?.link || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          if ("navigate" in client) return client.navigate(link);
          return undefined;
        }
      }
      if (clients.openWindow) return clients.openWindow(link);
      return undefined;
    }),
  );
});
`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
      "Service-Worker-Allowed": "/",
    },
  });
}
