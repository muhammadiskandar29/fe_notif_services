// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyA44-jpaYgDgYS_SwWcNlKDugxRDyYtmkA",
  authDomain: "hrm-apbatech.firebaseapp.com",
  projectId: "hrm-apbatech",
  storageBucket: "hrm-apbatech.firebasestorage.app",
  messagingSenderId: "261469906842",
  appId: "1:261469906842:web:41571bd8cf10453e7afc23",
  measurementId: "G-MHP9H3X921"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Notifikasi Baru';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || payload.data?.message || '',
    icon: '/vite.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
