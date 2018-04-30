// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as uiv from 'uiv'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)
Vue.use(VueResource)
Vue.use(uiv)
Vue.use(Vuex)
Vue.http.options.emulateJSON = true
const http = Vue.http
export default http
Vue.config.productionTip = false

Vue.prototype.$searchUrl = process.env.ES_ADDR + '/emp/rooms'
Vue.prototype.$commonTagsUrl = process.env.ES_ADDR + '/_all'
Vue.prototype.$editUrl = process.env.EMP_API + '/place'
Vue.prototype.$availabilityUrl = process.env.CALENDAR_API + '/availability/'
Vue.prototype.$googleCalendarUrl = process.env.CALENDAR_API + '/'

Vue.prototype.$defaultHeaders = {'Content-Type': 'application/json;charset=UTF-8'}
Vue.prototype.$emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
Vue.prototype.$cameraIcon = 'M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z'
Vue.prototype.$possibleThemes = ['casual', 'cozy', 'fancy', 'fun', 'grand', 'modern', 'professional', 'quiet', 'rustic', 'social', 'studious', 'zen']
Vue.prototype.$maxResultsShown = 20

var store = {
  state: {
    date: false,
    startTime: false,
    endTime: false
  },
  setDates (date, startTime, endTime) {
    this.state.date = date
    this.state.startTime = startTime
    this.state.endTime = endTime
  },
  clearDates () {
    this.state.date = false
    this.state.startTime = false
    this.state.endTime = false
  },
  removeSearchCriteria () {
    localStorage.removeItem('searchResults')
    localStorage.removeItem('searchCriteria')
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
