import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// In a real app, these would come from environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "vibra-v1.firebaseapp.com",
  projectId: "vibra-v1",
  storageBucket: "vibra-v1.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
