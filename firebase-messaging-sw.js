/* FCM Service Worker untuk THE FAMILY COMMUNITY */
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDvejLxAr6OYRmcd6qZAFNCtehTnM2KCWE",
  authDomain: "tfc-community-a6c19.firebaseapp.com",
  projectId: "tfc-community-a6c19",
  storageBucket: "tfc-community-a6c19.firebasestorage.app",
  messagingSenderId: "297440142421",
  appId: "1:297440142421:web:29346701d49a84bf1d60dc"
});

const messaging = firebase.messaging();

/* Notifikasi saat app di background */
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'THE FAMILY COMMUNITY';
  const options = {
    body: (payload.notification && payload.notification.body) || 'Ada pesan baru dari TFC',
    icon: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikhG4ctfYBNIFs7rdVpvhCnCeb0RyIwbZ63rXWco1dShU_7kQGpUE-FGOMlZn1MP036ecNW2V-vDAABB2Cb6TmIhtL0kQUjA8OPU-Vk8_yeUn208epzUZal_QiNWA5Luayca_Oq9Z719p-DEmJ7Lun4MGhhdIKnsUrJ87PybAM1xPkXFBCQRhY52R4tx_Z/s3264/1000425283.png',
    badge: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikhG4ctfYBNIFs7rdVpvhCnCeb0RyIwbZ63rXWco1dShU_7kQGpUE-FGOMlZn1MP036ecNW2V-vDAABB2Cb6TmIhtL0kQUjA8OPU-Vk8_yeUn208epzUZal_QiNWA5Luayca_Oq9Z719p-DEmJ7Lun4MGhhdIKnsUrJ87PybAM1xPkXFBCQRhY52R4tx_Z/s3264/1000425283.png',
    tag: 'tfc-notif',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

/* Klik notifikasi → buka aplikasi */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if (c.url.includes('the-family-community') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
