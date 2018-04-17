<template>
  <div class="main">
    <div v-if="pageWidth > 846">
        <!-- commenting out Intro.vue based on Nico's feedback.
        We can try out BrowseAll without the Intro for few days and
        see if we want to delete Intro or re-add it to BrowseAll.
        <Intro></Intro>
        -->
    </div>
    <div v-else>
        <div class="browseAllTitle">
        <h1>{{pageTitle}}</h1>
        </div>
    </div>
    <div class="search-wrapper">
      <h4>Know what you're after?</h4>
      <form>
        <input type="text" v-model="search" placeholder="Search by name..."/>
        <router-link :to="'/browsename/' + this.search" tag="button" class="btn btn-primary">Search</router-link>
      </form>
    </div>
    <h4>Or browse by theme:</h4>
    <div class="row">
      <div v-for="theme in themes" :key="theme.image" class="browseThemes">
          <a :href="'/browse/' + theme.image">
              <img :src="'/static/images/' + theme.image + '.png'"  :alt="theme.caption">
              <p>{{theme.caption}}</p>
          </a>
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
        {image: 'celebratory', caption: 'Celebratory'},
        {image: 'cozy', caption: 'Cozy'},
        {image: 'fancy', caption: 'Fancy'},
        {image: 'fun', caption: 'Fun'},
        {image: 'professional', caption: 'Professional'},
        {image: 'quiet', caption: 'Quiet'},
        {image: 'studious', caption: 'Studious'},
        {image: 'zen', caption: 'Zen'},
        {image: 'quiet', caption: 'Quiet'},
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
  }
}
</script>

<style scoped>
</style>
