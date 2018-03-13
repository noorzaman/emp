<template>
  <div class="main">
    <h1>Meeting Space Criteria</h1>
    <form method="GET" action="/" class="searchForm" v-on:submit.self.prevent v-on:click="searchByThemesAndAttributes()">
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
            <label>Theme</label> <br>
            <input type="checkbox" name="themeCheckbox" value="casual"> Casual <br>
            <input type="checkbox" name="themeCheckbox" value="celebratory"> Celebratory <br>
            <input type="checkbox" name="themeCheckbox" value="cozy"> Cozy <br>
            <input type="checkbox" name="themeCheckbox" value="fancy"> Fancy <br>
            <input type="checkbox" name="themeCheckbox" value="fun"> Fun <br>
            <input type="checkbox" name="themeCheckbox" value="professional"> Professional <br>
            <input type="checkbox" name="themeCheckbox" value="quiet"> Quiet <br>
            <input type="checkbox" name="themeCheckbox" value="studious"> Studious <br>
            <input type="checkbox" name="themeCheckbox" value="zen"> Zen <br>
        </div>
        <div class="form-group">
            <TypeAhead></TypeAhead>
            <p>Attributes for the space:</p>
            <p>No attributes added yet.</p>
        </div>
        <input type="submit" value="Search Spaces"/>
    </form>
    <table id="searchResultsTable" border="1" cellpadding="10px">
      <tr>
        <th>Image</th>
        <th>Space Name</th>
        <th>Email</th>
        <th>Theme</th>
        <th>Attributes</th>
      </tr>
    </table>
  </div>
</template>

<script>
import NumberSlider from './NumberSlider'
import DatePicker from './DatePicker'
import TypeAhead from './TypeAhead'
export default {
  name: 'Search',
  components: {
    'NumberSlider': NumberSlider,
    'DatePicker': DatePicker,
    'TypeAhead': TypeAhead
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
      this.sendSearchAndDisplayResult(jsonStr)
    },
    searchByEmail (email) {
      var jsonStr = '{"query": {"ids" : {"values" : ["' + email + '"]}}}'
      this.sendSearchAndDisplayResult(jsonStr)
    },
    searchByAttributes (attributes) {
      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["tags"], "query" : "' + attributes + '"}}}'
      this.sendSearchAndDisplayResult(jsonStr)
    },
    searchByThemesAndAttributes () {
      console.log('DEBUG: search by themes and attributes')
      var checkedThemes = []
      var options = document.getElementsByName('themeCheckbox')
      for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
          checkedThemes.push(options[i].value)
        }
      }

      var spaceDelimitedThemes = ''
      for (var j = 0; j < checkedThemes.length; j++) {
        spaceDelimitedThemes += checkedThemes[j]
        if (j < checkedThemes.length - 1) {
          spaceDelimitedThemes += ' '
        }
      }
      console.log('DEBUG: ' + spaceDelimitedThemes)

      // TODO: get space delimited attributes
      var spaceDelimitedAttributes = document.getElementById('attributes').value
      console.log('DEBUG: ' + spaceDelimitedAttributes)

      var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["meeting_place.theme", "tags"], "query" : "' +
        spaceDelimitedThemes + ' ' + spaceDelimitedAttributes + '"}}}'
      console.log('DEBUG: ' + jsonStr)
      this.sendSearchAndDisplayResult(jsonStr)
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

        var top20ResultsArray = []

        for (var n = 0; n < (this.searchResult.length > 20 ? 20 : this.searchResult.length); n++) {
          var matchedEntry = this.searchResult[n]._source
          top20ResultsArray[n] = [matchedEntry.meeting_place.image_location, matchedEntry.meeting_place.name,
            matchedEntry.meeting_place.email, matchedEntry.meeting_place.theme, matchedEntry.tags]
        }

        var table = document.getElementById('searchResultsTable')

        // clear table except heading
        var rowCount = table.rows.length
        for (var r = rowCount - 1; r > 0; r--) {
          table.deleteRow(r)
        }

        // for (var i = 0; i < 5; i++) {
        for (var i = 0; i < top20ResultsArray.length; i++) {
          // create a new row
          var newRow = table.insertRow(table.length)
          // for (var j = 0; j < 3; j++) {
          for (var j = 0; j < top20ResultsArray[i].length; j++) {
            // create a new cell
            var cell = newRow.insertCell(j)

            // add value to the cell
            cell.innerHTML = top20ResultsArray[i][j]
          }
        }
      }, error => {
        console.error(error)
      })
    },
    showImage (elementId, imageUrl) {
      document.getElementById(elementId).innerHTML = imageUrl
    }
  }
}

</script>

<style scoped>
</style>
