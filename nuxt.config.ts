const REQUIRED_ENV_VARIABLES = [
  "GQL_HOST",
  "GQL_TOKEN",
  "DB_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_REDIRECT_URI"
] as const;
const missingEnvVariables = REQUIRED_ENV_VARIABLES.filter(
  (env) => !process.env[env]
);
if (missingEnvVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVariables.join(", ")}`
  );
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  tailwindcss: {
    viewer: false
  },
  typescript: {
    shim: false
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("csm-")
    },
  },
  runtimeConfig: {
    db: {
      url: process.env.DB_URL
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      redirectUri: process.env.DISCORD_REDIRECT_URI
    }
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
  'graphql-client': {
    clients: {
      default: {
        host: "https://api.github.com/graphql",
        retainToken: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
        }
      },
    }
  },
  googleFonts: {
    families: {
      "JetBrains Mono": [400, 500, 700]
    }
  }
})
