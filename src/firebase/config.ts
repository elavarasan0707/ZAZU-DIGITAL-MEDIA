import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Official ZaZu Digital Media Firebase Configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyA8pGfC3cMsBbImDTzk9Er6m-NMpo7yVDA",
  authDomain: "zazu-digital-media.firebaseapp.com",
  projectId: "zazu-digital-media",
  storageBucket: "zazu-digital-media.firebasestorage.app",
  messagingSenderId: "434908483516",
  appId: "1:434908483516:web:76052037f20a278f7ce5b9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Connect to default Firestore database on zazu-digital-media project
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connection test on boot per Firebase guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase zazu-digital-media connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is running in cached offline mode or waiting for initial sync.');
    }
  }
}

testConnection();

export default app;
