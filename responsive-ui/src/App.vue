<template>
  <div id="app">
    <div v-if="pageWidth > 846">
        <DesktopNav></DesktopNav>
        <div class="space"></div>
    </div>
    <div v-else>
        <MobileHeader></MobileHeader>
    </div>
    <router-view/>
    <div v-if="pageWidth <= 846">
        <div class="clearFix"></div>
        <div class="footerSpace"></div>
        <MobileNav></MobileNav>
    </div>
  </div>
</template>

<script>
import DesktopNav from './components/DesktopNav'
import MobileNav from './components/MobileNav'
import MobileHeader from './components/MobileHeader'
export default {
  name: 'App',
  components: {
    'DesktopNav': DesktopNav,
    'MobileNav': MobileNav,
    'MobileHeader': MobileHeader
  },
  data () {
    return {
      pageWidth: document.documentElement.clientWidth
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    // hard coded space e-mails to store in local storage until Google calendar is used for booking
    // TODO - to be deleted when this functionality is added
    var bookedEmails = [
      'hannahs_test@emp.com', 'test_for_stephen@emaias.com'
    ]
    localStorage.setItem('bookedEmails', JSON.stringify(bookedEmails))
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    }
  }
}
</script>

<style>
 @import 'https://getbootstrap.com/docs/3.3/dist/css/bootstrap.min.css';
 @import '../static/css/styles.css';
</style>
