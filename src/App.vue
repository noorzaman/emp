<template>
  <div id="app">
    <div v-if="pageWidth > 1000">
        <DesktopNav></DesktopNav>
        <div class="space"></div>
    </div>
    <div v-else>
        <MobileHeader></MobileHeader>
    </div>
    <router-view/>
    <div v-if="pageWidth <= 1000">
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
 @import '../static/css/truncation.css';
</style>
