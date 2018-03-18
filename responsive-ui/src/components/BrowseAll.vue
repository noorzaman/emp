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
    <div v-for="(theme, index) in themes" v-bind:key="index" class="browseThemes">
        <a :href="'/browse/' + theme.image">
            <img :src="'/static/images/' + theme.image + '.png'"  :alt="theme.caption">
            <p>{{theme.caption}}</p>
        </a>
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
      pageWidth: document.documentElement.clientWidth
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
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
