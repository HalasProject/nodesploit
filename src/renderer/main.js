import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import vuetify from '@/plugins/vuetify'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
  components: { App },
  vuetify,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
