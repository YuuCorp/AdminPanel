// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    shim: false
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("csm-")
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "nuxt-icon-tw",
  ],

  googleFonts: {
    families: {
      "JetBrains Mono": [400, 500, 700]
    }
  }
})