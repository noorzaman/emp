<template>
  <div class="main">
    <h1>Previously Booked Spaces</h1>
   <div v-if="prevBookedSpaces.length === 0">
      <p>You have not booked any spaces yet.</p>
    </div>
    <div v-else>
      <div class="row">
        <div v-for="space in prevBookedSpaces" :key="space.email" class="bookedLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <h2>{{space.name}}</h2>
          <p>{{space.description}}</p>
          <img :src="space.image" :alt="space.name + 'image'" class="img-fluid img-thumbnail bookedImg">
          <p><strong>Capacity:</strong> {{space.capacity}}</p>
          <p><strong>Attributes</strong></p>
          <div v-if="space.attributes.length > 0">
            <ul v-bind:class="{ 'browseAttributesList' : longAttrList }">
              <li v-for="attribute in space.attributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
          <div v-else>
            <p>No attributes have been added for this space yet.</p>
          </div>
          <a :href="'/space/' + space.email" class="btn btn-primary">Space Details</a>
        </div>
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
      longAttrList: false
    }
  },
  mounted: function () {
    document.title = 'My Previously Booked Spaces'
    this.bookedEmails = JSON.parse(localStorage.getItem('bookedEmails'))
    if (this.bookedEmails != null && this.bookedEmails.length > 0) {
      this.createElasticSearchUrl()
      for (var i = 0; i < this.bookedEmails.length; i++) {
        this.searchByEmail(this.bookedEmails[i])
      }
    }
  },
  methods: {
    createElasticSearchUrl () {
      var empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com'
      var empIndex = 'emp'
      var empType = 'rooms'
      this.empUrl = empHost + '/' + empIndex + '/' + empType
    },
    searchByEmail (email) {
      var searchUrl = this.empUrl + '/' + email
      this.$http.get(searchUrl, email, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var spaceBody = result.body._source.space
        // check if will need to add scrollbar to any attributes list
        if (spaceBody.attributes.length >= 5) {
          this.longAttrList = true
        }
        var space = {
          email: email,
          name: spaceBody.name,
          description: spaceBody.description,
          capacity: spaceBody.capacity,
          attributes: spaceBody.attributes,
          image: spaceBody.image
        }
        this.prevBookedSpaces.push(space)
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
