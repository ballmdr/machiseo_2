const pkg = require('./package')
const environment = {
  ADMIN_SUB_ID: 'google-oauth2|110559176155139692267',
  API_URL: 'https://api.machiseo.net',
  BASE_URL: 'https://api.machiseo.net',
  CDN_URL: 'https://cdn.machiseo.net',
  REST_MONGO: 'https://mongo.machiseo.net',
  VOTE_SERVER: 'https://vote.machiseo.net',
  USER_DRUPAL: 'ballmdr',
  PASS_DRUPAL: 'M3n17v11',
  DISCOURSE_URL: 'https://community.machiseo.com',
  DISCOURSE_API_KEY: '71696264866640b9a7f1d58c61bdd3046ae3e72ae9664000c2fc8ee94bde7baf'
}
module.exports = {
  mode: 'universal',
  env: {
    baseUrl: environment.BASE_URL,
    cdnUrl: environment.CDN_URL,
    apiUrl: environment.API_URL,
    adminSubId: environment.ADMIN_SUB_ID,
    restMongoUrl: environment.REST_MONGO,
    voteServer: environment.VOTE_SERVER,
    userDrupal: environment.USER_DRUPAL,
    passDrupal: environment.PASS_DRUPAL,
    discourseUrl: environment.DISCOURSE_URL,
    discourseAPI: environment.DISCOURSE_API_KEY,
    prefix: 'jsonapi',
    findRouterPath: '/router/translate-path?path='
  },
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
