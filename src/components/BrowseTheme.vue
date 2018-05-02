<template>
  <NotFound v-if="notFound"></NotFound>
  <div v-else class="main">
    <h1>{{pageTitle}}</h1>
    <ScheduleSpace :email="scheduleEmail" :name="scheduleName" ref="scheduleSpace"></ScheduleSpace>
    <div v-if="!this.searchFinished">
      <p>Searching...</p>
    </div>
    <div v-else>
      <div v-if="!matches.length">
        <p>No matches were found for this theme.</p>
      </div>
      <div v-else>
        <div v-for="match in matches" :key="match.email" :class="[{ 'searchLocationManyMissing': attributesLength >= 4}, { 'searchLocationMedMissing': attributesLength >= 2 && attributesLength < 4}]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <h2>{{match.name}}</h2>
          <router-link :to="'/space/' + match.email">
            <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
          </router-link>
          <p v-if="match.description" class="block-with-text"><strong>Description:</strong> {{match.description}}</p>
          <p><strong>Capacity:</strong> {{match.capacity}}</p>
          <p><strong>Attributes:</strong></p>
          <div v-if="!match.attributes.length">
            <p>No attributes have been added for this space yet.</p>
          </div>
          <div v-else>
            <ul :class="{ 'attributesList' : match.longAttrList }" class="attrList">
              <li v-for="attribute in match.attributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
          <div class="searchBtns">
            <router-link :to="'/space/' + match.email" class="btn btn-primary resultsBtn">Details</router-link>
            <button class="btn btn-primary btnMargin resultsBtn" @click="submitGoogleCalForm(match.email, match.name)">Book</button>
            <router-link :to="'/edit-space/' + match.email" class="btn btn-primary btnMargin resultsBtn">Edit</router-link>
          </div>
        </div>
      </div>
      <div class="clearFix"></div>
      <div class="resultsFooterSpace"></div>
    </div>
  </div>
</template>

<script>
import NotFound from './NotFound'
import ScheduleSpace from './ScheduleSpace'

export default {
  name: 'BrowseTheme',
  components: {
    'NotFound': NotFound,
    'ScheduleSpace': ScheduleSpace
  },
  data () {
    return {
      notFound: false,
      pageTitle: this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces',
      empUrl: '',
      matches: [],
      searchFinished: false,
      attributesLength: 0,
      scheduleEmail: '',
      scheduleName: ''
    }
  },
  mounted () {
    document.title = this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces'
    // remove search criteria storage
    this.$store.clearDates()
    this.$store.removeSearchCriteria()
    this.searchByTheme(this.$route.params.theme)
  },
  methods: {
    searchByTheme (theme) {
      if (!this.$possibleThemes.includes(theme)) {
        this.notFound = true
        return
      }
      var search = {
        'query': {
          'term': {
            'space.themes': theme
          }
        }
      }
      var jsonStr = JSON.stringify(search)
      var searchUrl = this.$searchUrl + '/_search?from=0&size=' + this.$maxResultsShown

      this.$http.post(searchUrl, jsonStr, {
        headers: this.$defaultHeaders
      }).then(result => {
        var searchResult = result.body.hits.hits

        for (var n = 0; n < searchResult.length; n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          // get the maximum attributes length
          this.attributesLength = Math.max(this.attributesLength, entry.attributes.length)
          this.matches.push({
            email: email,
            name: entry.name,
            description: entry.description,
            image: entry.image,
            capacity: entry.capacity,
            attributes: entry.attributes ? entry.attributes : [],
            longAttrList: entry.attributes.length > 5
          })
        }
        this.searchFinished = true
      }, error => {
        console.error(error)
      })
    },
    /**
    * Submit Google Calendar form
    */
    submitGoogleCalForm (email, name) {
      this.scheduleEmail = email
      this.scheduleName = name
      this.$refs.scheduleSpace.submitForm()
    }
  }
}
</script>

<style scoped>
</style>
