<template>
  <div class="main">
    <h1>{{pageTitle}}</h1><br>
    <div class="row">
      <div v-for="theme in $possibleThemes" :key="theme" class="browseThemes">
        <router-link :to="'/browse/' + theme">
          <img :src="'/static/images/' + theme + '.png'" :alt="theme.charAt(0).toUpperCase() + theme.slice(1)" class="img-responsive">
          <p>{{theme.charAt(0).toUpperCase() + theme.slice(1)}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Intro from './Intro'
export default {
  name: 'BrowseAll',
  components: {
    'Intro': Intro
  },
  data () {
    return {
      pageTitle: 'Explore Meeting Spaces',
      search: []
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Browse Spaces'
    // remove search criteria storage
    this.$store.clearDates()
    this.$store.removeSearchCriteria()
  }
}
</script>

<style scoped>
</style>
