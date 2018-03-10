import Vue from 'vue'
import Router from 'vue-router'
import EmpTest from '@/components/EmpTest'
import AddEvent from '@/components/AddEvent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'EmpTest',
      component: EmpTest
    },
    {
      path: '/calendar',
      name: 'AddEvent',
      component: AddEvent
    }
  ],
  mode: 'history'
})
