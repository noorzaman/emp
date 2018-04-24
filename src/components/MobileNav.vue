<template>
    <div class="footer">
        <router-link to="/" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'browse' }">
          <img src="/static/images/browse.png" alt="Browse">
          <p>Browse</p>
        </router-link>
        <router-link to="/search-spaces" class="item" id="searchNavLink" v-bind:class="{ 'mobileNavActive': pageLocation === 'search' }">
          <img src="/static/images/search.png" alt="Search">
          <p>Search</p>
        </router-link>
        <router-link to="/booked-spaces" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'booked' }">
          <img src="/static/images/booked.png" alt="Booked Spaces">
          <p>Booked Spaces</p>
        </router-link>
        <router-link to="/add-space" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'addspace' }">
          <img src="/static/images/new.png" alt="Add Space">
          <p>Add Space</p>
        </router-link>
    </div>
</template>

<script>
export default {
  mounted: function () {
    document.getElementById('searchNavLink').addEventListener('click', this.removeSearchCriteria)
  },
  props: ['pageLocation'],
  methods: {
    removeSearchCriteria () {
      this.$store.resetDates()
      this.$store.removeSearchCriteria()
    }
  }
}
</script>
