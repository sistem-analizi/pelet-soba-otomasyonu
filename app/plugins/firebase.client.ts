import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const publicConfig = config.public as {
    firebaseApiKey?: string
    firebaseAuthDomain?: string
    firebaseDatabaseURL?: string
    firebaseProjectId?: string
  }

  const firebaseConfig: FirebaseOptions = {
    apiKey: publicConfig.firebaseApiKey,
    authDomain: publicConfig.firebaseAuthDomain,
    databaseURL: publicConfig.firebaseDatabaseURL,
    projectId: publicConfig.firebaseProjectId,
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const db = getDatabase(app)

  return {
    provide: {
      db,
    },
  }
})