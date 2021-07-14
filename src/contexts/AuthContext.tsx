import { createContext, useState, useEffect, ReactNode } from 'react';
import { firebase, auth } from '../services/firebase';
  
type User = {
    name: string;
    avatar: string;
    id: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}
  
type AuthContextProps = {
    children: ReactNode;
}
  
export const AuthContext = createContext({} as AuthContextType);
  
export function AuthContextProvider(props: AuthContextProps){
  
    const [user, setUser] = useState < User > ();
  
    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
            const { displayName, photoURL, uid} = user;
            if (!displayName || !photoURL) {
              throw new Error("Missig informatiom from Google acconut");
            } 
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
        }
      })
  
      return () => {
        unsubscribe();
      }
  
    }, [])
  
    async function signWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
  
      if (result.user) {
        const { displayName, photoURL, uid} = result.user;
        if (!displayName || !photoURL) {
          throw new Error("Missig informatiom from Google acconut");
        } 
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
      }
    }

    async function logout() {
      await firebase.auth().signOut().catch(err => {
        console.log(err);
      });

      setUser(undefined);
    }
  
    return (
      <AuthContext.Provider value={{user, signWithGoogle, logout}}>
        {props.children}
      </AuthContext.Provider>
    )
}