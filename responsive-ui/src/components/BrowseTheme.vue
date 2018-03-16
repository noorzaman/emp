<template>
  <div class="main">
    <div v-if="pageWidth > 846">
      <Intro></Intro>
    </div>
    <div v-else>
      <div class="browseAllTitle">
        <h1>Explore Meeting Spaces</h1>
      </div>
    </div>
    <div v-for="match of matches" :key="match.id">
        <div>
          <label>{{match.name}}</label><br>
          <img :src=match.image :alt=match.name width="400">
        </div>
        <ul v-for="attribute of match.attributes" :key="attribute">
          <li>{{attribute}}</li>
        </ul>
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
      pageWidth: document.documentElement.clientWidth,
      empUrl: '',
      matches: []
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.createElasticSearchUrl()
    this.searchByTheme(this.$route.params.theme)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    },
    createElasticSearchUrl () {
      var empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com'
      var empIndex = 'emp'
      var empType = 'rooms'
      this.empUrl = empHost + '/' + empIndex + '/' + empType
    },
    searchByTheme (theme) {
      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["meeting_place.theme"], "query" : "' + theme + '"}}}'
      this.sendSearchAndDisplayResult(jsonStr)
    },
    sendSearchAndDisplayResult (jsonStr) {
      var searchUrl = this.empUrl + '/_search?size=50&from=0'

      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var searchResult = result.body.hits.hits

        for (var n = 0; n < Math.min(searchResult.length, 5); n++) {
          var entry = searchResult[n]._source
          this.matches.push({id: n, name: entry.meeting_place.name, image: entry.meeting_place.image_location, attributes: entry.tags})
        }
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
