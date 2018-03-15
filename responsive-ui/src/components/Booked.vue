<template>
  <div class="main">
    <h1>My Previously Booked Spaces</h1>
    <div class="row">
        <div v-for="space in prevBookedSpaces" v-bind:key="space" class="bookedLocation col-sm-4">
                <h2>{{space.name}}</h2>
                <p>{{space.description}}</p>
                <img :src="space.image" :alt="space.name + 'image'" class="img-fluid img-thumbnail bookedImg">
                <a href="#" class="btn btn-primary">Space Details</a>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Booked',
  data () {
    return {
      bookedEmails: [
        '"rodpg@emp.com"', '"ssxnd@emp.com"', '"obqjw@emp.com"', '"rytjj@emp.com"'
      ],
      prevBookedSpaces: []
    }
  },
  mounted: function () {
    this.createElasticSearchUrl()
    this.searchByEmail()
  },
  methods: {
    createElasticSearchUrl () {
      var empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com'
      var empIndex = 'emp'
      var empType = 'rooms'
      this.empUrl = empHost + '/' + empIndex + '/' + empType
    },
    searchByEmail () {
      var jsonStr = '{"query": {"ids" : {"values" : [' + this.bookedEmails + '] }}}'
      this.sendSearchAndDisplayResult(jsonStr)
      console.log(jsonStr)
    },
    sendSearchAndDisplayResult (jsonStr) {
      var searchUrl = this.empUrl + '/_search?size=50&from=0'
      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        this.searchResult = result.body.hits.hits
        console.log(result.body.hits.hits)
        for (var i = 0; i < (this.searchResult.length > 20 ? 20 : this.searchResult.length); i++) {
          var matchedEntry = this.searchResult[i]._source
          var space = {
            name: matchedEntry.meeting_place.name,
            description: matchedEntry.meeting_place.description,
            image: matchedEntry.meeting_place.image_location
          }
          this.prevBookedSpaces.push(space)
        }
        console.log(this.prevBookedSpaces)
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
