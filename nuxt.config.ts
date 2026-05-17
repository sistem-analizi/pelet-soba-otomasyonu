// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: '_nuxt/',
  },
  css: ['~/assets/css/main.css'],
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseDatabaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
  },
})
