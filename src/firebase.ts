import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: "AIzaSyA44-jpaYgDgYS_SwWcNlKDugxRDyYtmkA",
  authDomain: "hrm-apbatech.firebaseapp.com",
  projectId: "hrm-apbatech",
  storageBucket: "hrm-apbatech.firebasestorage.app",
  messagingSenderId: "261469906842",
  appId: "1:261469906842:web:41571bd8cf10453e7afc23",
  measurementId: "G-MHP9H3X921",
  vapidKey: "BIJTT8wfkCRCOG3_D4ExEFcmfbpUL93aIjOzDUQuyXyrUqW6A7uTBWFPOf_G98_ekoZzjGx1QS6JYDT0qKEUjx0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('FCM Messaging is not supported in this browser context:', err);
  }
}

export const requestForToken = async (): Promise<string | null> => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: firebaseConfig.vapidKey,
      });
      if (currentToken) {
        return currentToken;
      } else {
        console.warn('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.warn('Permission not granted for notifications');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
