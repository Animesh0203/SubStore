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
      //Firebase Config
    }
  },
})