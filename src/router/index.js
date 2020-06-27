import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/home').default
    },
    {
      path: '/server',
      name: 'server',
      component: require('@/components/server').default
    },
    {
      path: '/payload',
      name: 'payload',
      component: require('@/components/payload').default
    },
    {
      path: '/victime/:socket_id',
      name: 'victime',
      component: require('@/components/victime/victime').default,
      props: true
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/settings').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
