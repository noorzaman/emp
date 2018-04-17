<template>
  <NotFound v-if="notFound"></NotFound>
  <div v-else class="main">
    <h1>{{pageTitle}}</h1>
    <div v-if="!this.searchFinished">
      <p>Searching...</p>
    </div>
    <div v-else>
      <div v-if="!matches.length">
        <p>No matches were found for this theme.</p>
      </div>
      <div v-else class="row">
        <div v-for="match in matches" :key="match.email" v-bind:class="[{ 'searchLocationManyMissing': results == 'long' }, { 'searchLocationMedMissing': results == 'medium' }]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <h2>{{match.name}}</h2>
          <p class="block-with-text">{{match.description}}</p>
          <a :href="'/space/' + match.email">
            <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
          </a>
          <p><strong>Capacity:</strong> {{match.capacity}}</p>
          <p><strong>Attributes</strong></p>
          <div v-if="!match.attributes.length">
            <p>No attributes have been added for this space yet.</p>
          </div>
          <div v-else>
            <ul v-bind:class="{ 'browseAttributesList' : match.spaceLongAttrList }" class="attrList">
              <li v-for="attribute in match.attributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
          <div class="searchBtns">
            <a :href="'/space/' + match.email" class="btn btn-primary">Space Details</a>
            <a :href="'/schedule-space/' + match.email + '/' + startDate + '/' + startTime + '/' + endTime" class="btn btn-primary btnMargin">Book</a>
            <a :href="'/edit-space/' + match.email" class="btn btn-primary btnMargin">Edit</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotFound from './NotFound'

export default {
  name: 'BrowseTheme',
  components: {
    'NotFound': NotFound
  },
  data () {
    return {
      notFound: false,
      pageTitle: this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces',
      empUrl: '',
      matches: [],
      searchFinished: false,
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
      results: ''
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces'
    this.searchByTheme(this.$route.params.theme)
  },
  methods: {
    searchByTheme (theme) {
      if (!this.possibleThemes.includes(theme)) {
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
      var searchSize = '10'
      var searchUrl = this.$searchUrl + '/_search?from=0&size=' + searchSize

      this.$http.post(searchUrl, jsonStr, {
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(result => {
        var searchResult = result.body.hits.hits

        for (var n = 0; n < searchResult.length; n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          if (entry.attributes.length >= 2) {
            this.results = 'medium'
            if (entry.attributes.length >= 4) {
              this.results = 'long'
            }
          }
          this.matches.push({
            email: email,
            name: entry.name,
            description: entry.description,
            image: entry.image,
            capacity: entry.capacity ? entry.capacity : 0,
            attributes: entry.attributes,
            spaceLongAttrList: entry.attributes.length >= 5
          })
        }
        this.searchFinished = true
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
