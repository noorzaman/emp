<template>
  <div class="main">
    <h1>Meeting Space Criteria</h1>
    <form method="GET" action="/" class="searchForm">
        <div class="form-group">
            <label>Capacity</label>
            <NumberSlider></NumberSlider>
        </div>
        <div class="form-group">
            <label>Meeting time</label>
            <DatePicker></DatePicker>
            <p>Time picker will go here</p>
        </div>
        <div class="form-group">
            <label>Theme</label>
            <input type="checkbox" name="vehicle" value="Bike"> Casual <br>
            <input type="checkbox" name="vehicle" value="Bike"> Celebratory <br>
            <input type="checkbox" name="vehicle" value="Bike"> Cozy <br>
            <input type="checkbox" name="vehicle" value="Bike"> Fancy <br>
            <input type="checkbox" name="vehicle" value="Bike"> Fun <br>
            <input type="checkbox" name="vehicle" value="Bike"> Professional <br>
            <input type="checkbox" name="vehicle" value="Bike"> Quiet <br>
            <input type="checkbox" name="vehicle" value="Bike"> Studious <br>
            <input type="checkbox" name="vehicle" value="Bike"> Zen <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another1 <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another2 <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another3 <br>
        </div>
        <div class="form-group">
            <label>Attributes</label>
            <p>Ex: food, WiFi, projector, etc.</p>
            <input type="text" placeholder="attributes search bar will go here"/>
            <p>Attributes for the space:</p>
            <p>No attributes added yet.</p>
        </div>
        <input type="submit" value="Search Spaces"/>
    </form>
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
import NumberSlider from './NumberSlider'
import DatePicker from './DatePicker'
export default {
  name: 'Search',
  components: {
    'NumberSlider': NumberSlider,
    'DatePicker': DatePicker
  }
}
export default {
  name: 'Search',
  components: {
  },
  data () {
    return {
      pageTitle: 'Search Meeting Spaces',
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
    searchByTheme (theme) {
      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["meeting_place.theme"], "query" : "' + theme + '"}}}'
      this.sendSearchAndDisplayResultrchAndDisplayResult(jsonStr)
    },
    searchByEmail (email) {
      var jsonStr = '{"query": {"ids" : {"values" : ["' + email + '"]}}}'
      this.sendSearchAndDisplayResultrchAndDisplayResult(jsonStr)
    },
    searchByAttributes (attributes) {
      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["tags"], "query" : "' + attributes + '"}}}'
      this.sendSearchAndDisplayResultrchAndDisplayResult(jsonStr)
    },
    searchByField (fields, keywords) {
      var jsonStr = ''

      if ((fields === null || fields === undefined || fields.trim() === '') &&
        (keywords === null || keywords === undefined || keywords.trim() === '')) {
        jsonStr = '{"query":{"match_all":{}},' + '"sort":[{"meeting_place.update_date":{"order":"desc"}}]}'
      } else if ((keywords !== null && keywords !== undefined && keywords.trim() !== '') &&
        (fields !== null && fields !== undefined && fields.trim() !== '')) {
        jsonStr = '{"query": {"simple_query_string" : {"fields" : ["' + fields + '"], "query" : "' + keywords + '"}}}'
      } else if (keywords === null || keywords === undefined || keywords.trim() === '') {
        jsonStr = '{"query": {"simple_query_string" : {"fields" : ["' + fields + '"], "query" : "' + '*' + '"}}}'
      } else if (fields === null || fields === undefined || fields.trim() === '') {
        jsonStr = '{"query": {"multi_match" : ' + '{"fields" : ["' + '*' + '"],' + '"query" : "' + keywords + '"}}}'
      }
      this.sendSearchAndDisplayResult(jsonStr)
    },
    matchAll () {
      var jsonStr = '{"query":{"match_all":{}},' + '"sort":[{"meeting_place.update_date":{"order":"desc"}}]}'
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
  }
}
</script>

<style scoped>
</style>
