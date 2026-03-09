import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqCR96ZCot9Oso00VxZGG4j4xhy34tFBQ",
  authDomain: "awa-dom-7ddf1.firebaseapp.com",
  projectId: "awa-dom-7ddf1",
  storageBucket: "awa-dom-7ddf1.firebasestorage.app",
  messagingSenderId: "617142231594",
  appId: "1:617142231594:web:fd86c03e7fa7629a315953"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
