import firebase from 'firebase/compat/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

//Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyD8Li5CemJ6M77GbOGIenX-BYQs8xr_oOE",
  authDomain: "examen-program-componentes.firebaseapp.com",
  projectId: "examen-program-componentes",
  storageBucket: "examen-program-componentes.firebasestorage.app",
  messagingSenderId: "918938074070",
  appId: "1:918938074070:web:118c665b18a573e8784277"
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
