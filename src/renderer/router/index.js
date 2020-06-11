import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
      path:'/payload',
      name:'payload',
      component: require('@/components/payload').default
    },
    {
      path:'/victime/:id',
      name:'victime',
      component: require('@/components/victime').default
    },
     {
      path:'/settings',
      name:'settings',
      component: require('@/components/settings').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
