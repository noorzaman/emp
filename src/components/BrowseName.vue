<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
    <div v-if="!this.searchFinished">
      <p>Searching...</p>
    </div>
    <div v-else>
      <div v-if="!matches.length">
        <p>No matches were found for this name.</p>
      </div>
      <div v-else class="row">
        <div v-for="match in matches" :key="match.email" class="bookedLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <h2>{{match.name}}</h2>
          <p>{{match.description}}</p>
          <a :href="'/space/' + match.email">
            <img :src="match.image" :alt="match.name + ' image'" class="img-fluid img-thumbnail searchImg">
          </a>
          <p><strong>Capacity:</strong> {{match.capacity}}</p>
          <p><strong>Attributes</strong></p>
          <div v-if="!match.attributes.length">
            <p>No attributes have been added for this space yet.</p>
          </div>
          <div v-else>
            <ul v-bind:class="{ 'browseAttributesList' : longAttrList }">
              <li v-for="attribute in match.attributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
          <a :href="'/space/' + match.email" class="btn btn-primary">Space Details</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrowseName',
  data () {
    return {
      pageTitle: 'Search by Name: ' + this.$route.params.name,
      empUrl: '',
      matches: [],
      longAttrList: false,
      searchFinished: false
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Search by Name: ' + this.$route.params.name
    this.searchByName(this.$route.params.name)
  },
  methods: {
    searchByName (name) {
      var search = {
        'query': {
          'simple_query_string': {
            'fields': ['space.name'],
            'query': name
          }
        }
      }
      var jsonStr = JSON.stringify(search)
      var searchSize = '10'
      var searchUrl = this.$searchUrl + '/_search?from=0&size=' + searchSize

      this.$http.post(searchUrl, jsonStr, {
        headers: this.$defaultHeaders
      }).then(result => {
        var searchResult = result.body.hits.hits

        for (var n = 0; n < searchResult.length; n++) {
          var email = searchResult[n]._id
          var entry = searchResult[n]._source.space
          // check if will need to add scrollbar to any attributes list
          if (entry.attributes.length >= 5) {
            this.longAttrList = true
          }
          this.matches.push({
            email: email,
            name: entry.name,
            description: entry.description,
            image: entry.image,
            capacity: entry.capacity ? entry.capacity : 0,
            attributes: entry.attributes
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
