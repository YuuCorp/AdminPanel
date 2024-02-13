// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    shim: false
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      "JetBrains Mono": [400, 500, 700]
    }
  }
})