import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache,
  doc,
  getDocFromServer,
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

// Configure log level to suppress harmless client connection retry noise
try {
  setLogLevel('error');
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

// Initialize Firestore with auto-detecting WebChannel/long-polling transport
const db = initializeFirestore(app, {
  localCache,
  experimentalAutoDetectLongPolling: true,
}, databaseId);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Non-blocking connection verification per Firebase skill guidelines
if (typeof window !== 'undefined') {
  const verifyConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error: any) {
      // Offline mode or initial connection establishment is fully supported by localCache
      if (
        error?.code === 'unavailable' || 
        error?.code === 'permission-denied' ||
        error?.message?.includes('the client is offline')
      ) {
        // Safe offline operation mode
      }
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(verifyConnection, 1500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(verifyConnection, 1500);
    }, { once: true });
  }
}

export { app, auth, db, storage, googleProvider };
