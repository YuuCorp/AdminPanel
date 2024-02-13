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
    "nuxt-lucide-icons",
    "@nuxtjs/apollo",
  ],

  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://api.github.com/graphql",
      }
    }
  },

  googleFonts: {
    families: {
      "JetBrains Mono": [400, 500, 700]
    }
  }
})