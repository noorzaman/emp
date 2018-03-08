import Vue from 'vue'
import Router from 'vue-router'
import BrowseAll from '@/components/BrowseAll'
import AddSpace from '@/components/AddSpace'
import Search from '@/components/Search'
import Booked from '@/components/Booked'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BrowseAll',
      component: BrowseAll,
      pageTitle: 'TITLE'
    },
    {
      path: '/add-space',
      name: 'AddSpace',
      component: AddSpace,
      pageTitle: 'TITLE'
    },
    {
      path: '/search-spaces',
      name: 'Search',
      component: Search,
      pageTitle: 'TITLE'
    },
    {
      path: '/booked-spaces',
      name: 'Booked',
      component: Booked,
      pageTitle: 'TITLE'
    }
  ],
  mode: 'history'
})
