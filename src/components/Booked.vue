<template>
  <div class="main">
    <h1>Previously Booked Spaces</h1>
    <div v-if="!prevBookedSpaces.length">
      <p>You have not booked any spaces yet.</p>
    </div>
    <div v-else class="row">
      <div v-for="space in prevBookedSpaces" :key="space.email" v-bind:class="[{ 'searchLocationManyMissing': results == 'long' }, { 'searchLocationMedMissing': results == 'medium' }]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <h2>{{space.name}}</h2>
        <p class="block-with-text">{{space.description}}</p>
        <a :href="'/space/' + space.email">
          <img :src="space.image" :alt="space.name + 'image'" class="img-fluid img-thumbnail bookedImg">
        </a>
        <p><strong>Capacity:</strong> {{space.capacity}}</p>
        <p><strong>Attributes</strong></p>
        <div v-if="!space.attributes.length">
          <p>No attributes have been added for this space yet.</p>
        </div>
        <div v-else>
          <ul v-bind:class="{ 'browseAttributesList' : longAttrList }">
            <li v-for="attribute in space.attributes" :key="attribute">{{attribute}}</li>
          </ul>
        </div>
        <a :href="'/space/' + space.email" class="btn btn-primary">Space Details</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Booked',
  data () {
    return {
      bookedEmails: [],
      prevBookedSpaces: [],
      longAttrList: false,
      results: ''
    }
  },
  mounted: function () {
    document.title = 'My Previously Booked Spaces'
    this.bookedEmails = JSON.parse(localStorage.getItem('bookedEmails'))
    if (this.bookedEmails) {
      for (var i = 0; i < this.bookedEmails.length; i++) {
        this.searchByEmail(this.bookedEmails[i])
      }
    }
  },
  methods: {
    searchByEmail (email) {
      var empUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms'
      var searchUrl = empUrl + '/' + email
      this.$http.get(searchUrl, email, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var space = result.body._source.space
        // check if will need to add scrollbar to any attributes list
        if (space.attributes.length >= 5) {
          this.longAttrList = true
        }
        if (space.attributes.length >= 2) {
          this.results = 'medium'
          if (space.attributes.lengt >= 4) {
            this.results = 'long'
          }
        }
        this.prevBookedSpaces.push({
          email: email,
          name: space.name,
          description: space.description,
          capacity: space.capacity,
          attributes: space.attributes,
          image: space.image
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
