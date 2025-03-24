// filepath: /c:/Users/Mohamed Dellai/Desktop/config/nextjs-boilerplate/public/firebase-messaging-sw.js


// Add version for cache management
const version = '1.0.0';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBJl6IoTwgZG9i1Sw5NOtNsACGtratc-Ac",
  authDomain: "nexgen-980c7.firebaseapp.com",
  projectId: "nexgen-980c7",
  storageBucket: "nexgen-980c7.appspot.com",
  messagingSenderId: "1056351202962",
  appId: "1:1056351202962:web:5ba99deb0780777151804b",
  measurementId: "G-BR1V0L8ZV1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  try {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      tag: 'finflow-notification',
      renotify: true,
      icon: "/icon-192x192.png",
      Badge: "/icon-96x96.png",
      image: "/icon-512x512.png",
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('[SW] Error showing notification:', error);
  }
});