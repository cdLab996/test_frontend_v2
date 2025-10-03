import { currentLocales } from './i18n/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // sourcemap: {
  //   server: false,
  //   client: false,
  // },
  // ssr: false,

  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/image', '@unocss/nuxt', '@nuxtjs/google-fonts'],
  devtools: { enabled: true },

  css: ['~/assets/css/style.scss'],

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000/api',
      // TODO: the api is currently unavailable. Add it for testing purposes
      useMockData: process.env.NUXT_PUBLIC_USE_MOCK_DATA === 'true' || true
    }
  },
  compatibilityDate: '2024-04-03',

  // vite: {
  //   css: {
  //     preprocessorOptions: {
  //       scss: {
  //         api: 'modern'
  //       }
  //     }
  //   }
  // },

  postcss: {
    plugins: {
      '@unocss/postcss': {},
      'postcss-preset-env': {
        stage: 1,
        features: {
          'nesting-rules': true
        }
      },
      'postcss-nested': {},
      'postcss-pxtorem': {
        // 更正插件名稱
        rootValue: 16,
        propList: ['*'],
        exclude: /node_modules/i
      },
      'autoprefixer': {
        overrideBrowserslist: ['last 2 versions', '> 1%']
      }
    }
  },

  googleFonts: {
    display: 'swap',
    download: false,
    families: {
      'Noto Sans TC': true
    }
  },

  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'zh-TW',
  },

  image: {
    provider: 'ipx',
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 75 // 設定品質
        }
      }
    }
  },

  unocss: {
    nuxtLayers: true
  }
})
