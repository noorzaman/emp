<template>
  <div class="search">
    <div class="form-group"><br>
      <button style="width:180px" :class="[showFullSearch ? 'btn-dark' : 'btn-light', 'btn']" @click="changeSearchToFull">Full Search</button>
      <button style="width:180px" :class="[showFullSearch ? 'btn-light' : 'btn-dark', 'btn']" @click="changeSearchToByName">Quick Search By Name</button>
    </div>
    <div v-if="!showFullSearch" class="search-wrapper">
      <label>Space Name</label><br>
      <input size="22" type="text" v-model="name" placeholder="Enter name..." @keyup.enter="searchByName"/><br><br>
      <button id="submitButton" class="btn btn-primary submitButton" @click="searchByName">Search Spaces</button>
    </div>
    <div v-else>
      <div>
        <h1>Meeting Space Criteria</h1>
        <p>Leave a criteria blank to indicate no preference.</p>
      </div>
      <div class="leftSearch">
        <div class="form-group">
          <label>Capacity</label>
          <NumberSlider :allowAny="true" :capacity="searchCriteria.capacity"></NumberSlider>
        </div>
        <div class="form-group">
          <label>Meeting Day</label>
          <DatePicker v-on:change="startDateChanged" :date_prop="searchCriteria.startDate"></DatePicker>
        </div>
        <div class="form-group">
          <label>Meeting Time</label>
          <br>
          <div class="timePicker">
            <TimePicker v-on:change="startTimeChanged" :time_prop="searchCriteria.startTime"></TimePicker>
          </div>
          <div class="to">
            <p>to</p>
          </div>
          <div class="timePicker">
            <TimePicker v-on:change="endTimeChanged" :time_prop="searchCriteria.endTime"></TimePicker>
          </div>
          <div class="clearFix"></div>
        </div>
      </div>
      <div class="rightSearch">
        <div class="form-group themes">
          <label>Theme</label><br>
          <ul class="checkbox-grid">
            <li v-for="theme in $possibleThemes" :key="theme">
              <input type="checkbox" name="themeCheckbox" :value="theme" :id="theme" v-model="selectedThemes"/>
              <label :for="theme" class="checkboxLabel">{{theme.charAt(0).toUpperCase() + theme.slice(1)}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group typeAhead">
          <TypeAhead :selectedAttributes="selectedAttributes" :allowCustom="false"></TypeAhead>
        </div>
      </div>
      <button id="submitButton" class="btn btn-primary submitButton" @click="fullSearch">Search Spaces</button>
    </div>
    <div class="clearFix"></div>
    <br>

    <br>
    <div v-if="searchCompleted">
      <h2 v-if="availableOnlyFilter.length === 1">Search Results: 1 space found</h2>
      <h2 v-else>Search Results: {{availableOnlyFilter.length}} spaces found</h2>
      <div class="form-group">
        <toggle-button v-if="!timeOmitted" @change="changeUserFilterKey" :value="false" :width=180 :height=25 :color="{checked: '#000', unchecked: '#444'}" :labels="{checked: 'Show all rooms', unchecked: 'Show only available rooms'}"/>
      </div>
      <div v-for="match in availableOnlyFilter" :key="match.email" :class="[{ 'searchLocationManyMissing': resultsLength == 'long' }, { 'searchLocationMedMissing': resultsLength == 'medium' }]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <div :class="{'matchTitle': match.matchPercent}">
          <p v-if="match.matchPercent" class="matchPercent" :class="[{ 'highMatch': match.matchPercent >= 80 }, { 'mediumMatch': match.matchPercent < 80 &&  match.matchPercent >= 50}, { 'lowMatch': match.matchPercent < 50 }]">{{match.matchPercent}}%</p>
          <h2>{{match.name}}</h2>
        </div>
        <div class="clearFix"></div>
        <p class="block-with-text">{{match.description}}</p>
        <router-link :to="'/space/' + match.email">
          <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
        </router-link>
        <div v-if="!searchingByName && match.matchPercent !== 100">
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
            <ul :class="{ 'missingItems': match.missThemes.length > 5 }">
              <li v-for="theme in match.missThemes" :key="theme">{{theme}}</li>
            </ul>
          </div>
          <div v-if="match.missAttributes.length" class="missingAttributes">
            <p><strong>Missing attributes</strong></p>
            <ul :class="{ 'missingItems': match.missAttributes.length > 5 }">
              <li v-for="attribute in match.missAttributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
        </div>
        <div class="clearFix"></div>
        <div class="searchBtns">
          <router-link :to="'/space/' + match.email" class="btn btn-primary btnMargin">Space Details</router-link>
          <router-link :to="'/schedule-space/' + match.email + '/' + match.name" class="btn btn-primary btnMargin">Book</router-link>
          <router-link :to="'/edit-space/' + match.email" class="btn btn-primary btnMargin">Edit</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NumberSlider from './NumberSlider'
import DatePicker from './DatePicker'
import TypeAhead from './TypeAhead'
import TimePicker from './TimePicker'
import axios from 'axios'

export default {
  name: 'Search',
  components: {
    'NumberSlider': NumberSlider,
    'DatePicker': DatePicker,
    'TypeAhead': TypeAhead,
    'TimePicker': TimePicker
  },
  computed: {
    availableOnlyFilter () {
      return this[this.userFilterKey]
    },
    all () {
      if (this.matches.length > 0) {
        return this.matches.slice().sort(this.sortByPercentage)
      }
      return this.matches
    },
    // filter out rooms that are labeled as busy
    available () {
      return this.matches.filter(function (el) {
        return !el.busy
      }).sort(this.sortByPercentage)
    }
  },
  data () {
    return {
      userFilterKey: 'available',
      searchCompleted: false,
      pageTitle: 'Search Meeting Spaces',
      matches: [],
      searchCriteria: {},
      numCriteria: 0,
      selectedThemes: [],
      selectedAttributes: [],
      resultsLength: '',
      startDate: new Date(), // default to today
      startTime: new Date(''), // empty date object
      endTime: new Date(''),
      timeOmitted: false,
      showFullSearch: true,
      name: '', // name used for search by name
      searchingByName: false
    }
  },
  mounted () {
    document.title = 'Search Spaces'
    var searchResults = JSON.parse(localStorage.getItem('searchResults'))
    var searchCriteria = JSON.parse(localStorage.getItem('searchCriteria'))

    if (searchResults) {
      this.matches = searchResults
      this.resultsLength = JSON.parse(localStorage.getItem('resultsLength'))
      this.searchCompleted = true
    }
    if (searchCriteria) {
      searchCriteria.startDate = new Date(searchCriteria.startDate)
      searchCriteria.startTime = new Date(searchCriteria.startTime)
      searchCriteria.endTime = new Date(searchCriteria.endTime)
      this.searchCriteria = searchCriteria
      this.selectedThemes = searchCriteria.themes ? searchCriteria.themes : []
      this.selectedAttributes = searchCriteria.attributes
    }
  },
  methods: {
    sortByPercentage (a, b) {
      if (a.matchPercent < b.matchPercent) {
        return 1
      }
      if (a.matchPercent > b.matchPercent) {
        return -1
      }
      return 0
    },
    /** This method is called when user selects/ deselects meeting start date.
    */
    startDateChanged (newDate) {
      this.startDate = newDate
    },
    /** This method is called when user selects meeting start time.
    */
    startTimeChanged (newTime) {
      this.startTime = newTime
    },
    /** This method is called when user selects meeting end time.
    */
    endTimeChanged (newTime) {
      this.endTime = newTime
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
    getFormattedDate () {
      var month = this.startDate.getMonth() + 1
      return this.startDate.getFullYear() + '-' + month + '-' + this.startDate.getDate()
    },
    getFormattedStartTime () {
      var timezoneHours = -1 * (this.startTime.getTimezoneOffset() / 60)
      var timezoneString = '-0'
      if (timezoneHours > 0) {
        timezoneString = '+0'
      }
      timezoneString += Math.abs(timezoneHours)
      timezoneString += ':00'
      if (this.startTime != null) {
        return this.pad(this.startTime.getHours(), 2) + ':' + this.pad(this.startTime.getMinutes(), 2) +
          ':00' + timezoneString
      }
    },
    getFormattedEndTime () {
      var timezoneHours = -1 * (this.endTime.getTimezoneOffset() / 60)
      var timezoneString = '-0'
      if (timezoneHours > 0) {
        timezoneString = '+0'
      }
      timezoneString += Math.abs(timezoneHours)
      timezoneString += ':00'
      if (this.endTime != null) {
        return this.pad(this.endTime.getHours(), 2) + ':' +
          this.pad(this.endTime.getMinutes(), 2) + ':00' + timezoneString
      }
    },
    pad (n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    },
    /**
    * Search by space name only
    */
    searchByName () {
      this.searchingByName = true
      this.searchCompleted = false
      this.timeOmitted = true
      this.$store.resetDates()
      this.$store.removeSearchCriteria()

      //  Edit distance signifies fuzziness. (If you're not sure what 'edit distance' means, look it up on the internet).
      //  While "magical", edit distance should be used with care.
      //  When user's search term consists of two or less letters
      //  then the edit distance of two will match any record in the dataset.
      //  Empirically, a "good" practice is to use edit distance of two for search terms of length
      //  five or more. It is also "reasonable" to use edit distance of one for search terms
      //  of length three or four. Edit distance should be 0 for search terms of length two or less.
      var editDistance = 0
      if (this.name.length >= 5) {
        editDistance = 2
      } else if (this.name.length >= 3) {
        editDistance = 1
      }

      var search = {
        'query': {
          'simple_query_string': {
            'fields': ['space.name'],
            //  ~N after a word signifies edit distance (fuzziness)
            //  See: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html
            'query': this.name + '~' + editDistance
          }
        }
      }
      this.runSearch(search)
    },
    /**
    * Run a full search
    */
    fullSearch () {
      this.searchingByName = false
      this.searchCompleted = false
      this.userFilterKey = 'available'
      this.timeOmitted = isNaN(this.startTime.getTime()) || isNaN(this.endTime.getTime())
      if (!this.timeOmitted) {
        this.$store.setDate(this.startDate)
        this.$store.setStartTime(this.startTime)
        this.$store.setEndTime(this.endTime)
      } else {
        this.$store.resetDates()
      }

      this.numCriteria = 0
      var spaceDelimitedThemes = this.getSpaceDelimitedThemes()
      var spaceDelimitedAttributes = this.getSpaceDelimitedAttributes()
      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      } else if (desiredCapacity !== '0') {
        this.numCriteria = 1
      }
      // search for half the capacity, but report capacity is not a match if actualCapacity < desiredCapacity
      var searchCapacity = parseInt(desiredCapacity) / 2
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
        this.numCriteria += themes.length + attributes.length
      }
      this.searchCriteria.startDate = this.startDate
      this.searchCriteria.startTime = this.startTime
      this.searchCriteria.endTime = this.endTime

      this.runSearch(search)
    },
    /**
    * Run the search query
    */
    runSearch (search) {
      var jsonStr = JSON.stringify(search)
      var searchSize = '20'
      var searchUrl = this.$searchUrl + '/_search?from=0&size=' + searchSize

      this.$http.post(searchUrl, jsonStr, {
        headers: this.$defaultHeaders
      }).then(result => {
        this.matches = []
        let searchResults = result.body.hits.hits
        let lst = []
        Object.assign(lst, ...Object.values(searchResults).map(k => lst.push(k._id)))
        let emails = lst.filter(Boolean)

        if (emails.length > 0) {
          // if no time was provided, process the results without an availableList
          if (this.timeOmitted) {
            this.process(searchResults, false)
            return
          }
          let availabilityData = {
            'calendars': emails,
            'start_time': this.getFormattedDate() + 'T' + this.getFormattedStartTime(),
            'end_time': this.getFormattedDate() + 'T' + this.getFormattedEndTime()
          }

          axios.put(this.$availabilityUrl, JSON.stringify(availabilityData), {
            headers: this.$defaultHeaders
          }).then(result => {
            let availableList = Object.values(result.data).map(el => {
              let filteredKeys = Object.keys(el).filter(key => {
                // only return available if it's not busy and there are no errors (indicating a private or non-existing email)
                return el[key].busy && el[key].busy.length === 0 && !(el[key].errors && el[key].errors.length > 0)
              })
              return filteredKeys[0]
            })
            this.process(searchResults, availableList)
          }, error => {
            console.error(error)
            alert('Looking up space availability failed.')
          })
        } else {
          this.matches = []
          this.finishedSearch()
        }
      }, error => {
        console.error(error)
        alert('Search failed.')
      })
    },
    /**
    * Process the search results and push results to this.matches
    */
    process (searchResults, availableList) {
      for (var n = 0; n < searchResults.length; n++) {
        var spaceId = searchResults[n]._id
        var entry = searchResults[n]._source.space

        if (!this.searchingByName) {
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
          if (!this.resultsLength === 'long' && (missingThemes.length >= 2 || missingAttributes.length >= 2)) {
            this.resultsLength = 'medium'
            if (missingThemes.length >= 4 || missingAttributes.length >= 4) {
              this.resultsLength = 'long'
            }
          }
          // if there is no availableList, default to not busy
          let isBusy = availableList ? !availableList.includes(spaceId) : false
          console.log(entry.name + ' is ' + (isBusy ? 'busy' : 'available'))
          this.matches.push({
            name: entry.name,
            description: entry.description,
            image: entry.image,
            theme: entry.themes,
            attributes: entry.attributes,
            email: spaceId,
            busy: isBusy,
            capacity: entry.capacity,
            missThemes: missingThemes,
            missAttributes: missingAttributes,
            //  Match percent: Make sure that match percent is never greater than 100%.
            //  This could happen when no criteria are selected and therefore numCriteria is zero.
            matchPercent: Math.min(100, Math.round((numMatches / this.numCriteria) * 100))
          })
        } else {
          // if this was a search by name, only this information is needed
          this.matches.push({
            name: entry.name,
            description: entry.description,
            image: entry.image,
            email: spaceId
          })
        }
      }
      this.finishedSearch()
    },
    /**
    * Stores the search criteria in localStorage, so that it is
    * available if a user clicks on a space and then navigates
    * back to the search page. Also scrolls to the results.
    */
    finishedSearch () {
      this.searchCompleted = true
      localStorage.setItem('searchCriteria', JSON.stringify(this.searchCriteria))
      localStorage.setItem('resultsLength', JSON.stringify(this.resultsLength))
      localStorage.setItem('searchResults', JSON.stringify(this.matches))
      // scroll to search results
      this.$nextTick(function () {
        // new elements finished rendering to the DOM
        document.getElementById('submitButton').scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'})
      })
    },
    /**
    * Switch filter key between 'all' and 'available'
    */
    changeUserFilterKey (sliderState) {
      if (sliderState.value) {
        console.log('showing all')
        this.userFilterKey = 'all'
      } else {
        console.log('showing available')
        this.userFilterKey = 'available'
      }
    },
    /**
    * Hide any previous search results and switch search type to full search
    */
    changeSearchToFull () {
      this.searchCompleted = false
      this.showFullSearch = true
    },
    /**
    * Hide any previous search results and switch search type to search by name
    */
    changeSearchToByName () {
      this.searchCompleted = false
      this.showFullSearch = false
    }
  }
}
</script>

<style scoped>
</style>
