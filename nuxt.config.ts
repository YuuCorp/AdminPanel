const REQUIRED_ENV_VARIABLES = [
  "DB_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_REDIRECT_URI",
  "YUUKO_API_URL"
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
  googleFonts: {
    families: {
      "JetBrains Mono": true
    }
  }
})
