<template>
  <div class="search">
    <h1>Meeting Space Criteria</h1>
    <div>
        <div class="leftSearch">
        <p>Leave a criteria blank to indicate no preference.</p>
        <br>
            <div class="form-group">
                <label>Capacity</label>
                <NumberSlider v-bind:allowAny="true"></NumberSlider>
            </div>
            <div class="form-group">
                <label>Meeting Day</label>
                <DatePicker v-on:change="startDateChanged"></DatePicker>
            </div>
            <div class="form-group">
                <label>Meeting Time</label>
                <br>
                <div class="timePicker">
                  <TimePicker v-on:change="startTimeChanged"/>
                </div>
                <div class="to">
                  <p>to</p>
                </div>
                <div class="timePicker">
                  <TimePicker v-on:change="endTimeChanged"/>
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
    <div v-for="match in matches" :key="match.email" v-bind:class="[{ 'searchLocationManyMissing': results == 'long' }, { 'searchLocationMedMissing': results == 'medium' }]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <div class="matchTitle">
        <p class="matchPercent" v-bind:class="[{ 'highMatch': match.matchPercent >= 80 }, { 'mediumMatch': match.matchPercent < 80 &&  match.matchPercent >= 50}, { 'lowMatch': match.matchPercent < 50 }]">{{match.matchPercent}}%</p>
        <h2>{{match.name}}</h2>
      </div>
      <div class="clearFix"></div>
      <p class="block-with-text">{{match.description}}</p>
      <a :href="'/space/' + match.email" target="_blank">
        <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
      </a>
      <div v-if="match.matchPercent !== 100">
        <div v-if="searchCriteria.capacity !== 0 && parseInt(searchCriteria.capacity) > parseInt(match.capacity)" class="missingCapacity">
          <ul>
            <li class="missingCapacity"><strong>Capacity NOT a match:</strong> has a capacity of {{match.capacity}}</li>
          </ul>
        </div>
        <div v-else>
          <p><strong>Capacity sufficient:</strong> has a capacity of {{match.capacity}}</p>
        </div>
        <div v-if="match.missThemes.length" class="missingThemes">
          <p><strong>Missing Themes</strong></p>
          <ul v-bind:class="{ 'missingItems': match.missThemes.length > 5 }">
            <li v-for="theme in match.missThemes" :key="theme">{{theme}}</li>
          </ul>
        </div>
        <div v-if="match.missAttributes.length" class="missingAttributes">
          <p><strong>Missing tags</strong></p>
          <ul v-bind:class="{ 'missingItems': match.missAttributes.length > 5 }">
            <li v-for="attribute in match.missAttributes" :key="attribute">{{attribute}}</li>
          </ul>
        </div>
      </div>
      <div class="clearFix"></div>
      <div class="searchBtns">
        <a :href="'/space/' + match.email" class="btn btn-primary">Space Details</a>
        <a href="javascript:;" class="btn btn-primary btnMargin">Book</a>
        <a :href="'/edit-space/' + match.email" class="btn btn-primary btnMargin">Edit</a>
      </div>
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
      ],
      results: '',
      startDate: null,
      startTime: null,
      endTime: null
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Search Spaces'
  },
  methods: {

    /** This method is called when user selects a date on the date picker.
    */
    startDateChanged (newDate) {
      this.startDate = newDate
      // console.log(this.startDate)
    },

    /** This method is called when user selects meeting start time.
    */
    startTimeChanged (newValue) {
      this.startTime = newValue
    },

    /** This method is called when user selects meeting end time.
    */
    endTimeChanged (newValue) {
      this.endTime = newValue
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
        spaceDelimitedAttributes += selectedAttributes[k].innerText
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
      //  console.log('DEBUG: spaceDelimitedAttributes are: ' + spaceDelimitedAttributes)

      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      } else if (desiredCapacity !== '0') {
        this.numCriteria = 1
      }
      // search for half the capacity, but report capacity is not a match if actualCapacity < desiredCapacity
      var searchCapacity = parseInt(desiredCapacity) / 2
      console.log('DEBUG: ' + desiredCapacity)
      console.log('DEBUG: ' + searchCapacity)

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
                'gte': searchCapacity
              }
            }
          }
        }
        this.searchCriteria = {capacity: desiredCapacity}
        console.log('SEARCH CRITERIA CAPACITY: ' + searchCapacity)
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
                    'gte': searchCapacity
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
        console.log('SEARCH CRITERIA CAPACITY: ' + this.searchCriteria.capacity)
        // console.log('DEBUG: ' + jsonStr)
      }

      var jsonStr = JSON.stringify(search)
      var searchSize = '20'
      var searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?from=0&size=' + searchSize

      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        this.matches.length = 0
        var searchResult = result.body.hits.hits
        for (var n = 0; n < searchResult.length; n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          // find matches
          var numMatches = 0
          if (this.searchCriteria.capacity !== 0 && parseInt(entry.capacity) >= parseInt(this.searchCriteria.capacity)) {
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
          if (missingThemes.length >= 2 || missingAttributes.length >= 2) {
            this.results = 'medium'
            if (missingThemes.length >= 4 || missingAttributes.length >= 4) {
              this.results = 'long'
            }
          }
          // console.log('numMatches:' + numMatches)
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
            //  Match percent: Make sure that match percent is never greater than 100%.
            //  This could happen when no criteria are selected and therefore numCriteria is zero.
            matchPercent: Math.min(100, Math.round((numMatches / this.numCriteria) * 100))
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
