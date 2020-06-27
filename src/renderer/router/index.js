import Vue from 'vue'
import Router from 'vue-router'

import server from '@R/views/server.vue'
import payload from '@R/views/payload.vue'
import victime from '@R/views/victime.vue'
import settings from '@R/views/settings.vue'
import home from '@R/views/home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/server',
      name: 'server',
      component: server
    },
    {
      path: '/payload',
      name: 'payload',
      component: payload
    },
    {
      path: '/victime/:socket_id',
      name: 'victime',
      component: victime,
      props: true
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
