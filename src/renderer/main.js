import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Vuelidate from 'vuelidate'

import vuetify from '@/plugins/vuetify' // path to vuetify export

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Vuesax)
Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  vuetify,
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
