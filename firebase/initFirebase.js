import firebase from 'firebase/compat/app'
// import { getApps , initializeApp } from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/analytics'
import 'firebase/compat/performance'

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export default function initFirebase() {
    if (!firebase.apps.length){
        firebase.initializeApp(clientCredentials)
        if (typeof window !== 'undefined') {
            if('measurementId' in clientCredentials){
                firebase.analytics()
                firebase.performance()
            }           
        }
        console.log('Firebase was successfully init.')
    }
}