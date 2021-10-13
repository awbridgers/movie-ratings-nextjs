import React, {useState, createContext, useEffect} from 'react';
import {auth} from './config';
import firebase from 'firebase/app';
import {User} from 'firebase/auth'

interface IProvider {
  children: React.ReactNode;
}

export const AuthContext = createContext<User | null>(null);


const AuthProvider = ({children}: IProvider) =>{
  const [user, setUser] = useState<User | null>(null)
  useEffect(()=>{
    return auth.onAuthStateChanged((user)=>setUser(user))
  },[])
  return (
    <AuthContext.Provider value = {user}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider