<template>
    <div class="footer">
        <router-link to="/" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'browse' }">
          <div v-if="pageLocation === 'browse'">
            <img class="mobile-nav-icon" src="/static/images/home-selected.png" alt="Browse">
          </div>
          <div v-else>
            <img class="mobile-nav-icon" src="/static/images/home.png" alt="Browse">
          </div>
          <p>Browse</p>
        </router-link>
        <router-link to="/search-spaces" class="item" id="searchNavLink" v-bind:class="{ 'mobileNavActive': pageLocation === 'search' }">
          <div v-if="pageLocation === 'search'">
            <img class="mobile-nav-icon" src="/static/images/search-selected.png" alt="Search">
          </div>
          <div v-else>
            <img class="mobile-nav-icon" src="/static/images/search.png" alt="Search">
          </div>
          <p>Search</p>
        </router-link>
        <router-link to="/booked-spaces" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'booked' }">
          <div v-if="pageLocation === 'booked'">
            <img class="mobile-nav-icon" src="/static/images/booked-selected.png" alt="Booked Spaces">
          </div>
          <div v-else>
            <img class="mobile-nav-icon" src="/static/images/booked.png" alt="Booked Spaces">
          </div>
          <p>Booked</p>
        </router-link>
        <router-link to="/add-space" class="item" v-bind:class="{ 'mobileNavActive': pageLocation === 'addspace' }">
          <div v-if="pageLocation === 'addspace'">
            <img class="mobile-nav-icon" src="/static/images/add-selected.png" alt="Add Space">
          </div>
          <div v-else>
            <img class="mobile-nav-icon" src="/static/images/add.png" alt="Add Space">
          </div>
          <p>Add</p>
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
      this.$store.clearDates()
      this.$store.removeSearchCriteria()
    }
  }
}
</script>
