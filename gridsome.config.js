// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Provita Biodiversidad',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/home/content.json',
        typeName: 'HomeContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/about/content.json',
        typeName: 'AboutContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/datasets/content.json',
        typeName: 'DatasetsContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/occurrences/content.json',
        typeName: 'OccurrencesContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/ecosystems/content.json',
        typeName: 'EcosystemsContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/faunarb/content.json',
        typeName: 'FaunaRbContent'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/ecosystems/vcards/**/content.md',
        typeName: 'RiskCard'
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/ecosystems/labels/labels.md',
        typeName: 'Labels'
      }
    },
    {
      use: "gridsome-plugin-i18n",
      options: {
        locales: [ // locales list
          'es-ve',
          'en-us'
        ],
        pathAliases: { // path segment alias for each locales
          'es-ve': 'es',
          'en-us': 'en'
        },
        fallbackLocale: 'es-ve', // fallback language
        defaultLocale: 'es-ve', // default language
        dateTimeFormats: {
          'en-us': {
            short: {
              year: 'numeric', month: 'numeric', day: 'numeric'
            },
            long: {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: 'numeric', minute: 'numeric'
            },
            longdateonly: {
              year: 'numeric', month: 'long', day: 'numeric',
            }
          },
          'es-ve': {
            short: {
              year: 'numeric', month: 'numeric', day: 'numeric'
            },
            long: {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: 'numeric', minute: 'numeric', hour12: true
            },
            longdateonly: {
              year: 'numeric', month: 'long', day: 'numeric',
            }
          }
        },
        enablePathRewrite: true, // rewrite path with locale prefix, default: true
        rewriteDefaultLanguage: false, // rewrite default locale, default: true
        messages: {}
      }
    },
    {
      use: 'gridsome-plugin-gtm',
      options: {
        id: 'G-E07PJGQ7Z',
        enabled: true,
        debug: true
      }
    }
  ]
}
