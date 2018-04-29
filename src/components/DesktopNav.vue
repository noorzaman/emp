<template>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
            <router-link to="/"><img class="logo" src="/static/images/meeting-white.png" alt=""></router-link>
            <h3 class="empheading">Meet Anywhere</h3>
            <p class="empsubheading">The right meeting space for any situation</p>
        </div>
        <div>
          <ul class="nav navbar-nav navbar-right">
            <li><router-link to="/" v-bind:class="{ 'desktopNavActive': pageLocation === 'browse' }">Browse Spaces</router-link></li>
            <li id="searchNavLink"><router-link to="/search-spaces" v-bind:class="{ 'desktopNavActive': pageLocation === 'search' }" >Search Space</router-link></li>
            <li><router-link to="/booked-spaces" v-bind:class="{ 'desktopNavActive': pageLocation === 'booked' }">My Booked Spaces</router-link></li>
            <li><router-link to="/add-space" v-bind:class="{ 'desktopNavActive': pageLocation === 'addspace' }" id="desktop-add-space-link">Add Space</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>
export default {
  mounted: function () {
    document.getElementById('searchNavLink').addEventListener('click', this.removeSearchCriteria)
  },
  props: ['pageLocation'],
  methods: {
    removeSearchCriteria () {
      this.$store.clearDates()
      this.$store.removeSearchCriteria()
    }
  }
}
</script>
