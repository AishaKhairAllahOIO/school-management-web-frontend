importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp
({
  apiKey: "AIzaSyA17KU-K_RM6rUFEsAEcaIxDWheChRo4PU",
  authDomain: "school-management-a3191.firebaseapp.com",
  projectId: "school-management-a3191",
  storageBucket: "school-management-a3191.firebasestorage.app",
  messagingSenderId: "982316058108",
  appId: "1:982316058108:web:a3aa744036e24bbc4bde79",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => 
{
  console.log("Background Message:", payload);

  const title =
    payload.notification?.title ?? "School Management System";

  const options = 
  {
    body: payload.notification?.body ?? "You have a new notification.",

    icon: "/icons/notification-icon.png",

    badge: "/icons/notification-badge.png",

    image: payload.notification?.image,

    data: payload.data ?? {},

    tag: payload.data?.tag ?? "school-notification",

    renotify: true,

    requireInteraction: false,

    silent: false,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => 
{
  event.notification.close();

  const url = event.notification.data?.url ?? "/";

  event.waitUntil(clients.openWindow(url));
});