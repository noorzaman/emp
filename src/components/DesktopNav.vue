<template>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
            <router-link to="/"><img class="logo" src="/static/images/meeting-logo-big.png" alt=""></router-link>
            <h3 class="empheading">M e e t&nbsp;&nbsp;A n y w h e r e</h3>
            <p class="empsubheading">The right meeting space for any situation</p>
        </div>
        <div>
          <ul class="nav navbar-nav navbar-right">
            <li><router-link to="/" v-bind:class="{ 'desktopNavActive': pageLocation === 'browse' }">Browse Spaces</router-link></li>
            <li id="searchNavLink"><router-link to="/search-spaces" v-bind:class="{ 'desktopNavActive': pageLocation === 'search' }" >Search Space</router-link></li>
            <li><router-link to="/booked-spaces" v-bind:class="{ 'desktopNavActive': pageLocation === 'booked' }">My Booked Spaces</router-link></li>
            <li><router-link to="/add-space" v-bind:class="{ 'desktopNavActive': pageLocation === 'addspace' }">Add Space</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>
export default {
  mounted: function () {
    document.getElementById('searchNavLink').addEventListener('click', this.handleSearchNavClick)
  },
  props: ['pageLocation'],
  methods: {
    handleSearchNavClick () {
      localStorage.removeItem('searchResults')
      localStorage.removeItem('searchCriteria')
      localStorage.removeItem('resultsLength')
    }
  }
}
</script>
