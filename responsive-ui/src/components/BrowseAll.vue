<template>
  <div class="main">
    <div v-if="pageWidth > 846">
        <Intro></Intro>
    </div>
    <div v-else>
        <div class="browseAllTitle">
        <h1>{{pageTitle}}</h1>
        </div>
    </div>
    <div class="search-wrapper">
      <h4>Know what you're after?</h4>
      <form>
        <input type="text" size="50" v-model="search" placeholder="Search by name..."/>
        <router-link :to="'/browsename/' + this.search" tag="button" class="btn btn-primary">Search</router-link>
      </form>

      <!--button class="btn btn-primary" v-on:click="">Search</button-->
      <!--a :href="'/browse/' + document.getElementById('name').value">
        <button class="btn btn-primary">Search</button>
      </a-->
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
      pageWidth: document.documentElement.clientWidth,
      search: []
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Browse Spaces'
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
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

<style scoped>
</style>
