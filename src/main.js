
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import Vuelidate from 'vuelidate'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
