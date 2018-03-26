<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
    <div v-for="match in matches" :key="match.email" class="bookedLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <h2>{{match.name}}</h2>
      <p>{{match.description}}</p>
      <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
      <ul v-for="attribute of match.attributes" :key="attribute">
        <li>{{attribute}}</li>
      </ul>
      <a :href="'/space/' + match.email" class="btn btn-primary">Space Details</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrowseTheme',
  data () {
    return {
      pageTitle: this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces',
      pageWidth: document.documentElement.clientWidth,
      empUrl: '',
      matches: []
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = this.$route.params.theme.charAt(0).toUpperCase() + this.$route.params.theme.slice(1) + ' Spaces'
    window.addEventListener('resize', this.handleResize)
    this.searchByTheme(this.$route.params.theme)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    },
    searchByTheme (theme) {
      var search = {
        'query': {
          'term': {
            'space.themes': theme
          }
        }
      }
      var jsonStr = JSON.stringify(search)
      var searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?size=50&from=0'

      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var searchResult = result.body.hits.hits

        for (var n = 0; n < Math.min(searchResult.length, 5); n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          this.matches.push({
            email: email,
            name: entry.name,
            description: entry.description,
            image: entry.image,
            attributes: entry.attributes
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
