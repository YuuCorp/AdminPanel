const REQUIRED_ENV_VARIABLES = [
  "DB_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_REDIRECT_URI",
  "YUUKO_API_URL",
  "TRUSTED_USERS",
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
    public: {
      yuukoApiUrl: process.env.YUUKO_API_URL
    },
    private: {
      protectedUsers: process.env.TRUSTED_USERS
    },
    db: {
      url: process.env.DB_URL,
    },
    anilist: {
      clientId: process.env.ANILIST_CLIENT_ID,
      clientSecret: process.env.ANILIST_CLIENT_SECRET,
      redirectUri: process.env.ANILIST_REDIRECT_URI
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
    "shadcn-nuxt",
    "nuxt-icon",
    "nuxt-typed-router",
    "@nuxtjs/seo"
  ],
  site: {
    url: "https://auth.yuuko.dev",
    name: "Yuuko Auth",
    description: "Sign in to AniList via Yuuko to access personalized commands",
    defaultLocale: "en",
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  googleFonts: {
    families: {
      "JetBrains Mono": true,
      "Inter": "400..800",
    }
  }
})