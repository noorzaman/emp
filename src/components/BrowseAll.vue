<template>
  <div class="main">
    <h1>{{pageTitle}}</h1><br>
    <div class="row">
      <div v-for="theme in themes" :key="theme.image" class="browseThemes">
        <router-link :to="'/browse/' + theme.image">
          <img :src="'/static/images/' + theme.image + '.png'" :alt="theme.caption" class="img-responsive">
          <p>{{theme.caption}}</p>
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
      themes: [
        {image: 'casual', caption: 'Casual'},
        {image: 'cozy', caption: 'Cozy'},
        {image: 'fancy', caption: 'Fancy'},
        {image: 'fun', caption: 'Fun'},
        {image: 'grand', caption: 'Grand'},
        {image: 'modern', caption: 'Modern'},
        {image: 'professional', caption: 'Professional'},
        {image: 'quiet', caption: 'Quiet'},
        {image: 'rustic', caption: 'Rustic'},
        {image: 'social', caption: 'Social'},
        {image: 'studious', caption: 'Studious'},
        {image: 'zen', caption: 'Zen'}
      ],
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
