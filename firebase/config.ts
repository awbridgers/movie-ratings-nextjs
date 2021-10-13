import {initializeApp, getApps, getApp } from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getAuth} from 'firebase/auth'



const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
}


let app;
if(!getApps().length){
  app = initializeApp(config);
}
else{
  app = getApp();
}


export const db = getDatabase(app);
export const auth = getAuth(app);