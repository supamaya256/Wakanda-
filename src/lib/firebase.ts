import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache,
  setLogLevel
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const databaseId = (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId;

// Configure log level to suppress harmless client connection retry noise and offline warnings
try {
  setLogLevel('silent');
} catch {
  // Ignored if unsupported
}

// Configure resilient persistent IndexedDB multi-tab cache for instant (sub-5ms) responses
let localCache;
try {
  localCache = persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  });
} catch {
  localCache = memoryLocalCache();
}

// Initialize Firestore with force long-polling transport for rock-solid iframe and proxy reliability
const db = initializeFirestore(app, {
  localCache,
  experimentalForceLongPolling: true,
}, databaseId);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage, googleProvider };
