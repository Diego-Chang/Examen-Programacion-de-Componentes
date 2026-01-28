import firebase from 'firebase/compat/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

//Firebase configuration.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

//Firebase Database and Auth initialization and export.
firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const auth = firebase.auth()
export { firestore, auth }

//Register function. Uses Email and Password.
export const register = (username, email, password) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (response) => updateProfile(response.user, { displayName: username})
  )
}

//Login function. Uses Email and Password.
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

//Logout fuinction.
export const logout = () => {
  return auth.signOut()
}
