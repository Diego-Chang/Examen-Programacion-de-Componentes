import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

//Auth context
export const AuthContext = createContext()

//Exports context of Auth.
export const useAuth = () => {
  return useContext(AuthContext)
}

//Saves Auth related data in it's variables, including the current user logged in, if a user is logged, and a loading state.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [usrLoggedIn, setUsrLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({ email: user.email, username: user.displayName, uid: user.uid})
        setUsrLoggedIn(true)
      }
      else {
        setCurrentUser(null)
        setUsrLoggedIn(false)
      }
      setLoading(false)
    })
  }, [])

//Provider of Auth Context. Any component wrapped on it can import and use the stored variables via useAuth.
  return (
    <AuthContext.Provider value={{ currentUser, usrLoggedIn, loading }}>{children}</AuthContext.Provider>
  )
}