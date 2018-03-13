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
    <span>{{this.$route.params.theme}} search results:</span>
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
      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["meeting_place.theme"], "query" : "' + clickedTheme + '"}}}'
      this.sendSearchAndDisplayResult(jsonStr)
    },
    sendSearchAndDisplayResult (jsonStr) {
      var searchUrl = this.empUrl + '/_search?size=50&from=0'
      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
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
  },
  beforeMount () {
    this.searchByTheme(this.$route.params.theme)
  }
}
</script>

<style scoped>
</style>
