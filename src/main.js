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

Vue.prototype.$searchUrl = process.env.SEARCH_ADDR + '/emp/rooms'
Vue.prototype.$commonTagsUrl = process.env.COMMON_TAGS_ADDR + '/_all'
Vue.prototype.$editUrl = process.env.EDIT_ADDR + '/dev/place'
Vue.prototype.$availabilityUrl = process.env.AVAILABILITY_ADDR + '/availability/'
Vue.prototype.$googleCalendarUrl = process.env.GOOGLE_CALENDAR_ADDR + '/'

Vue.prototype.$defaultHeaders = {'Content-Type': 'application/json;charset=UTF-8'}
Vue.prototype.$emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
Vue.prototype.$possibleThemes = ['casual', 'cozy', 'fancy', 'fun', 'grand', 'modern', 'professional', 'quiet', 'rustic', 'social', 'studious', 'zen']

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
    localStorage.removeItem('resultsLength')
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
