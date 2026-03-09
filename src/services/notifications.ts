import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Alert } from "react-native";

let messaging: any = null;

export const initializeNotifications = async () => {
  try {
    if (typeof window !== "undefined") {
      messaging = getMessaging();
      
      const token = await getToken(messaging, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Erreur notifications:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });

export const sendNotification = async (
  userId: string,
  title: string,
  body: string
) => {
  // Cette fonction nécessite un backend pour envoyer des notifications
  // via l'API Firebase Admin SDK
  console.log("Notification à envoyer:", { userId, title, body });
};
