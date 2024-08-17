// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "nuxt-vuefire"],
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    config: {
      apiKey: "AIzaSyCX7pV6zgXX2EyY6GXRR2dOzwMvrqmq5Pc",
      authDomain: "substore-1f80d.firebaseapp.com",
      projectId: "substore-1f80d",
      storageBucket: "substore-1f80d.appspot.com",
      messagingSenderId: "829797065640",
      appId: "1:829797065640:web:01195dd9eb23236b06739d"
    }
  },
})