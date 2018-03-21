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
      path: '/browse/:theme',
      name: 'BrowseTheme',
      component: BrowseTheme,
      pageTitle: 'TITLE'
    },
    {
      path: '/add-space',
      name: 'AddSpace',
      component: AddSpace,
      pageTitle: 'TITLE'
    },
    {
      path: '/edit-space/:spaceId',
      name: 'EditSpace',
      component: EditSpace,
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
    },
    {
      path: '/space/:spaceId',
      name: 'ViewOneSpace',
      component: ViewOneSpace,
      pageTitle: 'TITLE'
    },
    {
      path: '/schedule-space',
      name: 'ScheduleSpace',
      component: ScheduleSpace,
      pageTitle: 'TITLE',
      props: true
    }
  ],
  mode: 'history'
})
