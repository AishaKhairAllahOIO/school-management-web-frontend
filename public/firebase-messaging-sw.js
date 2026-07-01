importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA17KU-K_RM6rUFEsAEcaIxDWheChRo4PU",
  authDomain: "school-management-a3191.firebaseapp.com",
  projectId: "school-management-a3191",
  storageBucket: "school-management-a3191.firebasestorage.app",
  messagingSenderId: "982316058108",
  appId: "1:982316058108:web:a3aa744036e24bbc4bde79",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "New notification";

  const options = {
    body: payload.notification?.body || "",
    icon: "/favicon.ico",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});