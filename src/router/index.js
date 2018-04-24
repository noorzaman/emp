import Vue from 'vue'
import Router from 'vue-router'
import BrowseAll from '@/components/BrowseAll'
import AddSpace from '@/components/AddSpace'
import EditSpace from '@/components/EditSpace'
import Search from '@/components/Search'
import Booked from '@/components/Booked'
import BrowseTheme from '@/components/BrowseTheme'
import ViewOneSpace from '@/components/ViewOneSpace'
import ScheduleSpace from '@/components/ScheduleSpace'
import NotFound from '@/components/NotFound'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'BrowseAll',
      component: BrowseAll
    },
    {
      path: '/browse/:theme',
      name: 'BrowseTheme',
      component: BrowseTheme
    },
    {
      path: '/add-space',
      name: 'AddSpace',
      component: AddSpace
    },
    {
      path: '/edit-space/:spaceId',
      name: 'EditSpace',
      component: EditSpace
    },
    {
      path: '/search-spaces',
      name: 'Search',
      component: Search
    },
    {
      path: '/booked-spaces',
      name: 'Booked',
      component: Booked
    },
    {
      path: '/space/:spaceId',
      name: 'ViewOneSpace',
      component: ViewOneSpace
    },
    {
      path: '/schedule-space/:spaceId/:spaceName',
      name: 'ScheduleSpace',
      component: ScheduleSpace
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})

export default router
