<template>
  <div class="search">
    <h1>Meeting Space Criteria</h1>
    <form method="GET" action="/" class="searchForm" v-on:submit.self.prevent v-on:click="searchByThemesAndAttributesAndCapacity()">
        <div class="leftSearch">
        <p>Leave a space blank to indicate no preference.</p>
        <br>
            <div class="form-group">
                <label>Capacity</label>
                <NumberSlider></NumberSlider>
            </div>
            <div class="form-group">
                <label>Meeting Day</label>
                <DatePicker></DatePicker>
            </div>
            <div class="form-group">
                <label>Meeting Time</label>
                <br>
                <div class="timePicker">
                  <TimePicker></TimePicker>
                </div>
                <div class="to">
                  <p>to</p>
                </div>
                <div class="timePicker">
                  <TimePicker></TimePicker>
                </div>
                <div class="clearFix"></div>
            </div>
        </div>
        <div class="rightSearch">
            <div class="form-group themes">
                <label>Theme</label> <br>
                <ul class="checkbox-grid">
                    <li><input type="checkbox" name="themeCheckbox" value="casual" />Casual</li>
                    <li><input type="checkbox" name="themeCheckbox" value="celebratory" />Celebratory</li>
                    <li><input type="checkbox" name="themeCheckbox" value="cozy" />Cozy</li>
                    <li><input type="checkbox" name="themeCheckbox" value="fancy" />Fancy</li>
                    <li><input type="checkbox" name="themeCheckbox" value="fun" />Fun</li>
                    <li><input type="checkbox" name="themeCheckbox" value="lively" />Lively</li>
                    <li><input type="checkbox" name="themeCheckbox" value="modern" />Modern</li>
                    <li><input type="checkbox" name="themeCheckbox" value="professional" />Professional</li>
                    <li><input type="checkbox" name="themeCheckbox" value="quiet" />Quiet</li>
                    <li><input type="checkbox" name="themeCheckbox" value="rustic" />Rustic</li>
                    <li><input type="checkbox" name="themeCheckbox" value="studious" />Studious</li>
                    <li><input type="checkbox" name="themeCheckbox" value="zen" />Zen</li>
                </ul>
            </div>
            <div class="form-group typeAhead">
                <TypeAhead></TypeAhead>
            </div>
        </div>
        <input type="submit" value="Search Spaces" class="btn btn-primary submitButton"/>
    </form>
    <div class="clearFix"></div>
    <br>
    <br>
    <div v-for="match in matches" :key="match.id" class="bookedLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <h2>{{match.name}}</h2>
      <p>{{match.description}}</p>
      <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail bookedImg">
      <p>Email: {{match.email}}</p>
      <p>Capacity: {{match.capacity}}</p>
      <p>Theme: {{match.theme}}</p>
      <p>Attributes:</p>
      <ul v-for="attribute of match.attributes" :key="attribute">
        <li>{{attribute}}</li>
      </ul>
      <a href="#" class="btn btn-primary">Space Details</a>
    </div>
  </div>
</template>

<script>
import NumberSlider from './NumberSlider'
import DatePicker from './DatePicker'
import TypeAhead from './TypeAhead'
import TimePicker from './TimePicker'
export default {
  name: 'Search',
  components: {
    'NumberSlider': NumberSlider,
    'DatePicker': DatePicker,
    'TypeAhead': TypeAhead,
    'TimePicker': TimePicker
  },
  data () {
    return {
      pageTitle: 'Search Meeting Spaces',
      pageWidth: document.documentElement.clientWidth,
      empUrl: '',
      matches: []
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
    searchByThemesAndAttributesAndCapacity () {
      // console.log('DEBUG: search by themes and attributes')
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
      //  console.log('DEBUG: ' + spaceDelimitedThemes)

      var selectedAttributes = document.getElementsByClassName('attr')
      var spaceDelimitedAttributes = ''
      for (var k = 0; k < selectedAttributes.length; k++) {
        spaceDelimitedAttributes += selectedAttributes[k].id
        if (k < selectedAttributes.length - 1) {
          spaceDelimitedAttributes += ' '
        }
      }
      // console.log('DEBUG: ' + spaceDelimitedAttributes)

      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      }
      // console.log('DEBUG: ' + desiredCapacity)

      var search = ''
      if ((spaceDelimitedThemes === null || spaceDelimitedThemes === undefined || spaceDelimitedThemes.trim() === '') &&
        (spaceDelimitedAttributes === null || spaceDelimitedAttributes === undefined || spaceDelimitedAttributes.trim() === '')) {
        search = {
          'query': {
            'range': {
              'space.capacity': {
                'gte': desiredCapacity
              }
            }
          }
        }
      } else {
        var multisearch = spaceDelimitedThemes + ' ' + spaceDelimitedAttributes
        search = {
          'query': {
            'bool': {
              'must': {
                'multi_match': {
                  'query': multisearch,
                  'fields': ['space.themes', 'space.attributes']
                }
              },
              'filter': {
                'range': {
                  'space.capacity': {
                    'gte': desiredCapacity
                  }
                }
              }
            }
          }
        }

        //  console.log('DEBUG: ' + jsonStr)
        var jsonStr = JSON.stringify(search)
        this.sendSearchAndDisplayResult(jsonStr)
      }
    },
    matchAll () {
      var jsonStr = '{"query":{"match_all":{}},' + '"sort":[{"space.updated_ts":{"order":"desc"}}]}'
      this.sendSearchAndDisplayResult(jsonStr)
    },
    sendSearchAndDisplayResult (jsonStr) {
      var searchUrl = this.empUrl + '/_search?size=50&from=0'

      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        this.matches.length = 0
        var searchResult = result.body.hits.hits
        for (var n = 0; n < Math.min(searchResult.length, 20); n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          this.matches.push({
            name: entry.name,
            description: entry.description,
            image: entry.image,
            theme: entry.themes,
            attributes: entry.attributes,
            email: email,
            capacity: entry.capacity
          })
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
