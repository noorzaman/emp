// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as uiv from 'uiv'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(uiv)
Vue.http.options.emulateJSON = true
const http = Vue.http
export default http
Vue.config.productionTip = false
Vue.prototype.$searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms'
Vue.prototype.$editUrl = 'https://3p8vyivi98.execute-api.us-east-1.amazonaws.com/dev/place'
Vue.prototype.$availabilityUrl = 'http://development.6awinxwfj9.us-east-1.elasticbeanstalk.com/availability/'
Vue.prototype.$defaultHeaders = {'Content-Type': 'application/json;charset=UTF-8'}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
