<template>
  <div class="search">
    <h1>Meeting Space Criteria</h1>
    <div>
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
                <label>Theme</label><br>
                <ul  class="checkbox-grid">
                  <li v-for="theme in possibleThemes" :key="theme">
                    <input type="checkbox" name="themeCheckbox" :value="theme" :id="theme" v-model="selectedThemes"/>
                    <label :for="theme" class="checkboxLabel">{{theme.charAt(0).toUpperCase() + theme.slice(1)}}</label>
                  </li>
                </ul>
            </div>
            <div class="form-group typeAhead">
                <TypeAhead></TypeAhead>
            </div>
        </div>
        <button class="btn btn-primary submitButton" @click="search">Search Spaces</button>
    </div>
    <div class="clearFix"></div>
    <br>
    <br>
    <div id="searchResults"></div>
    <h2 v-if="matches.length == 1" id="searchResults1">Search Results: {{matches.length}} space found</h2>
    <h2 v-if="matches.length > 1" id="searchResults2">Search Results: {{matches.length}} spaces found</h2>
    <div v-for="match in matches" :key="match.email" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <div class="matchTitle">
        <p class="matchPercent" v-bind:class="[{ 'highMatch': match.matchPercent >= 80 }, { 'mediumMatch': match.matchPercent < 80 &&  match.matchPercent >= 50}, { 'lowMatch': match.matchPercent < 50 }]">{{match.matchPercent}}%</p>
        <h2>{{match.name}}</h2>
      </div>
      <div class="clearFix"></div>
      <p>{{match.description}}</p>
      <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
      <div v-if="match.matchPercent !== 100">
        <div v-if="searchCriteria.capacity !== 0" class="missingCapacity">
          <p><strong>Capacity not a match:</strong> space has a capacity of {{match.capacity}}</p>
        </div>
        <div v-if="match.missThemes.length > 0" class="missingThemes">
          <p><strong>Missing Themes</strong></p>
          <ul v-bind:class="{ 'missingItems': match.missThemes.length > 5 }">
            <li v-for="theme in match.missThemes" :key="theme">{{theme}}</li>
          </ul>
        </div>
        <div v-if="match.missAttributes.length > 0" class="missingAttributes">
          <p><strong>Missing Attributes</strong></p>
          <ul v-bind:class="{ 'missingItems': match.missThemes.length > 5 }">
            <li v-for="attribute in match.missAttributes" :key="attribute">{{attribute}}</li>
          </ul>
        </div>
      </div>
      <div class="clearFix"></div>
      <a :href="'/space/' + match.email" target="_blank" class="btn btn-primary">Space Details</a>
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
      matches: [],
      searchCriteria: {},
      numCriteria: 0,
      selectedThemes: [],
      possibleThemes: [
        'casual',
        'celebratory',
        'cozy',
        'fancy',
        'fun',
        'lively',
        'modern',
        'professional',
        'quiet',
        'rustic',
        'studious',
        'zen'
      ]
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Search Spaces'
    window.addEventListener('resize', this.handleResize)
    this.createElasticSearchUrl()
  },
  beforeDestroy () {
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

    /**
    * This function returns a string of space delimited
    * themes. It returns empty string when no theme is selected.
    */
    getSpaceDelimitedThemes () {
      var spaceDelimitedThemes = ''
      for (var j = 0; j < this.selectedThemes.length; j++) {
        spaceDelimitedThemes += this.selectedThemes[j]
        if (j < this.selectedThemes.length - 1) {
          spaceDelimitedThemes += ' '
        }
      }
      return spaceDelimitedThemes
    },

    /**
    * This function returns a string of space delimited
    * attributes. It returns empty string when no attribute is selected.
    */
    getSpaceDelimitedAttributes () {
      var selectedAttributes = document.getElementsByClassName('attr')
      var spaceDelimitedAttributes = ''
      for (var k = 0; k < selectedAttributes.length; k++) {
        spaceDelimitedAttributes += selectedAttributes[k].id
        if (k < selectedAttributes.length - 1) {
          spaceDelimitedAttributes += ' '
        }
      }
      return spaceDelimitedAttributes
    },
    search () {
      this.numCriteria = 0
      // console.log('DEBUG: search by themes and attributes')
      var spaceDelimitedThemes = this.getSpaceDelimitedThemes()
      //  console.log('DEBUG: ' + spaceDelimitedThemes)
      var spaceDelimitedAttributes = this.getSpaceDelimitedAttributes()
      //  console.log('DEBUG: ' + spaceDelimitedAttributes)

      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      } else if (desiredCapacity !== '0') {
        this.numCriteria = 1
      }
      // console.log('DEBUG: ' + desiredCapacity)

      var search = ''
      var themes = []
      var attributes = []

      //  If neither theme nor any attributes is selected, then just search by capacity.
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
        themes = spaceDelimitedThemes.split(' ')
        attributes = spaceDelimitedAttributes.split(' ')
        if (themes[0] === '') {
          themes = []
        }
        if (attributes[0] === '') {
          attributes = []
        }
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
        this.searchCriteria = {capacity: desiredCapacity, themes: themes, attributes: attributes}
        console.log('themes.length: ' + themes.length + ' attributes.length: ' + attributes.length)
        this.numCriteria += themes.length + attributes.length
        console.log('NUM CRITERIA: ' + this.numCriteria)
        // console.log('SEARCH CRITERIA CAPACITY: ' + this.searchCriteria.capacity)
        // console.log('DEBUG: ' + jsonStr)
      }

      var jsonStr = JSON.stringify(search)
      var searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?size=50&from=0'

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
          // find matches
          var numMatches = 0
          if (this.searchCriteria.capacity !== 0 && entry.capacity === this.searchCriteria.capacity) {
            numMatches = 1
          }
          var searchThemes = this.searchCriteria.themes
          var missingThemes = []
          if (searchThemes !== null && searchThemes !== undefined) {
            for (var i = 0; i < searchThemes.length; i++) {
              if (entry.themes.includes(searchThemes[i])) {
                numMatches++
              } else {
                missingThemes.push(searchThemes[i])
              }
            }
          }

          var searchAttributes = this.searchCriteria.attributes
          var missingAttributes = []
          if (searchAttributes !== null && searchAttributes !== undefined) {
            for (var j = 0; j < searchAttributes.length; j++) {
              if (entry.attributes.includes(searchAttributes[j])) {
                numMatches++
              } else {
                missingAttributes.push(searchAttributes[j])
              }
            }
          }

          console.log('numMatches:' + numMatches)
          this.matches.push({
            name: entry.name,
            description: entry.description,
            image: entry.image,
            theme: entry.themes,
            attributes: entry.attributes,
            email: email,
            capacity: entry.capacity,
            missThemes: missingThemes,
            missAttributes: missingAttributes,
            matchPercent: Math.round((numMatches / this.numCriteria) * 100)
          })
        }
        // scroll to search results
        this.$nextTick(function () {
          // new elements finished rendering to the DOM
          document.getElementById('searchResults').scrollIntoView({behavior: 'smooth'})
        })
      }, error => {
        console.error(error)
      })
    }
  }
}

</script>

<style scoped>
</style>
