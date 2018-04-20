<template>
    <div class="footer">
        <router-link to="/">
            <a href="#" class="item">
                <img src="/static/images/browse.png" alt="alt text">
            </a>
        </router-link>
        <router-link to="/search-spaces">
            <a href="#" class="item" id="searchNavLink">
                <img src="/static/images/search.png" alt="alt text">
            </a>
        </router-link>
        <router-link to="/booked-spaces">
            <a href="#" class="item">
                <img src="/static/images/booked.png" alt="alt text">
            </a>
        </router-link>
        <router-link to="/add-space">
            <a href="/add-space" class="item">
                <img src="/static/images/new.png" alt="alt text">
            </a>
        </router-link>
    </div>
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
      localStorage.removeItem('resultsLength')
    }
  }
}
</script>
