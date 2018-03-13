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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
