import { initializeApp, getApps, getApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const db = getDatabase(app)

  return {
    provide: {
      db
    }
  }
})