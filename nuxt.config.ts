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
    "nuxt-graphql-client",
    "shadcn-nuxt"
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  // 'graphql-client': {
  //   clients: {
  //     default: {
  //       host: "https://api.github.com/graphql",
  //       retainToken: true,
  //       headers: {
  //         "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
  //       }
  //     },
  //   }
  // },

  googleFonts: {
    families: {
      "JetBrains Mono": [400, 500, 700]
    }
  }
})
