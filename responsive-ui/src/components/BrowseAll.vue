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
    <div v-for="theme in themes" v-bind:key="theme" class="browseThemes">
        <a href="#" v-on:click="searchByTheme(theme.image)">
            <img :src="'/static/images/' + theme.image + '.png'"  :alt="theme.caption">
            <p>{{theme.caption}}</p>
        </a>
    </div>
    <table id="resultsTable" border="1" cellpadding="10px">
      <tr>
        <th>Space Name</th>
        <th>Space Email</th>
        <th>Space Description</th>
      </tr>
    </table>
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
      empUrl: '',
      searchResult: ''
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.createElasticSearchUrl()
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
    searchByTheme (clickedTheme) {
      var searchUrl = this.empUrl + '/_search'
      var queryStr = '?q=meeting_place.theme:' + clickedTheme

      this.$http.get(searchUrl + queryStr).then(result => {
        this.searchResult = result.body.hits.hits

        var top5ResultsArray = []

        for (var n = 0; n < (this.searchResult.length > 5 ? 5 : this.searchResult.length); n++) {
          var matchedEntry = this.searchResult[n]._source.meeting_place
          top5ResultsArray[n] = [matchedEntry.name, matchedEntry.email, matchedEntry.description]
        }

        var table = document.getElementById('resultsTable')

        // clear table except heading
        var rowCount = table.rows.length
        for (var r = rowCount - 1; r > 0; r--) {
          table.deleteRow(r)
        }

        // for (var i = 0; i < 5; i++) {
        for (var i = 0; i < top5ResultsArray.length; i++) {
          // create a new row
          var newRow = table.insertRow(table.length)
          // for (var j = 0; j < 3; j++) {
          for (var j = 0; j < top5ResultsArray[i].length; j++) {
            // create a new cell
            var cell = newRow.insertCell(j)

            // add value to the cell
            cell.innerHTML = top5ResultsArray[i][j]
          }
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
