import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBYRRbwtyFyj8zFgbuyc3YI66cc0x2PoH0",
  authDomain: "pettycash-66974.firebaseapp.com",
  projectId: "pettycash-66974",
  storageBucket: "pettycash-66974.firebasestorage.app",
  messagingSenderId: "1097956389667",
  appId: "1:1097956389667:web:21f80eb364804e0ff0d296"
}

const app: FirebaseApp = initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)

export default app
