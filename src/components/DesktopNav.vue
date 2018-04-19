<template>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
            <router-link to="/"><img class="logo" src="/static/images/meeting-logo.png" alt=""></router-link>
            <h3 class="empheading">Meet Anywhere</h3>
            <p class="empsubheading">The right meeting space for any situation</p>
        </div>
        <div id="navbar">
          <ul class="nav navbar-nav navbar-right">
            <li><router-link to="/">Browse Spaces</router-link></li>
            <li id="searchNavLink"><router-link to="/search-spaces">Search Space</router-link></li>
            <li><router-link to="/booked-spaces">My Booked Spaces</router-link></li>
            <li><router-link to="/add-space">Add Space</router-link></li>
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
  methods: {
    handleSearchNavClick () {
      localStorage.removeItem('searchResults')
      localStorage.removeItem('searchCriteria')
      localStorage.removeItem('results')
    }
  }
}
</script>
