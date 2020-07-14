
import Vue from 'vue'

import App from '@R/App'
import router from '@R/router'
import store from '@R/store'

import Vuelidate from 'vuelidate'
import '@R/registerServiceWorker'
import vuetify from '@R/plugins/vuetify'

// import 'prismjs/plugins/download-button/
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
