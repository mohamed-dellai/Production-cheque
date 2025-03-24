import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBJl6IoTwgZG9i1Sw5NOtNsACGtratc-Ac",
    authDomain: "nexgen-980c7.firebaseapp.com",
    projectId: "nexgen-980c7",
    storageBucket: "nexgen-980c7.appspot.com",
    messagingSenderId: "1056351202962",
    appId: "1:1056351202962:web:5ba99deb0780777151804b",
    measurementId: "G-BR1V0L8ZV1"
  };

export var app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
  try {
    if (!messaging) {
      console.log('[Debug] Messaging not initialized');
      throw new Error('Messaging is not initialized');
    }

    console.log('[Debug] Checking service worker support...');
    if (!('serviceWorker' in navigator)) {
      console.log('[Debug] Service workers not supported');
      throw new Error('Service workers are not supported');
    }

    console.log('[Debug] Current permission status:', Notification.permission);
    let permission = Notification.permission;
    
    if (permission === 'default') {
      console.log('[Debug] Requesting permission...');
      permission = await Notification.requestPermission();
      console.log('[Debug] Permission status after request:', permission);
    }

    if (permission !== 'granted') {
      console.log('[Debug] Permission not granted');
      throw new Error('Notification permission not granted');
    }

    console.log('[Debug] Registering service worker...');
    const registration = await navigator.serviceWorker
      .register('/firebase-messaging-sw.js', {
        scope: '/api',
      })
      .catch((err) => {
        console.log('[Debug] Service worker registration failed:', err);
        throw new Error(`Service Worker registration failed: ${err.message}`);
      });

    console.log('[Debug] Service Worker registered with scope:', registration.scope);

    console.log('[Debug] Getting FCM token...');
    const currentToken = await getToken(messaging, { 
      vapidKey: 'BLjWKqt8pF6L_nJcWQQRagtwZ56D4RgFhnu0u4WedCJM36sjQ6wrpnSZbq9cxnbDdrqxfGnJJYc5ioChvbW_px8',
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log('[Debug] FCM Token obtained:', currentToken);
      return currentToken;
    } else {
      console.log('[Debug] No token received');
      throw new Error('No registration token available');
    }
  } catch (err) {
    console.error('[Debug] Token retrieval error:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      console.log('[Debug] Setting up message listener');
      onMessage(messaging, (payload) => {
        console.log('[Debug] Message received in foreground:', payload);
        resolve(payload);
      });
    } else {
      console.log('[Debug] Message listener not set up - messaging not initialized');
    }
  });

  