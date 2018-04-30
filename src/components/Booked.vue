<template>
  <div class="main">
    <ScheduleSpace :email="scheduleEmail" :name="scheduleName" ref="scheduleSpace"></ScheduleSpace>
    <h1>Previously Booked Spaces</h1>
    <div v-if="!prevBookedSpaces.length">
      <p>You have not booked any spaces yet.</p>
    </div>
    <div v-else class="row">
      <div v-for="space in prevBookedSpaces" :key="space.email" :class="[{ 'searchLocationManyMissing': attributesLength >= 4}, { 'searchLocationMedMissing': attributesLength >= 2 && attributesLength < 4}]" class="searchLocation col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <h2>{{space.name}}</h2>
        <p class="block-with-text">{{space.description}}</p>
        <router-link :to="'/space/' + space.email">
          <img :src="space.image" :alt="space.name + 'image'" class="img-fluid img-thumbnail bookedImg">
        </router-link>
        <p><strong>Capacity:</strong> {{space.capacity}}</p>
        <p><strong>Attributes</strong></p>
        <div v-if="!space.attributes.length">
          <p>No attributes have been added for this space yet.</p>
        </div>
        <div v-else>
          <ul :class="{ 'attributesList' : space.longAttrList }" class="attrList">
            <li v-for="attribute in space.attributes" :key="attribute">{{attribute}}</li>
          </ul>
        </div>
        <div class="searchBtns">
          <router-link :to="'/space/' + space.email" class="btn btn-primary">Details</router-link>
          <button class="btn btn-primary btnMargin" @click="submitGoogleCalForm(space.email, space.name)">Book</button>
          <router-link :to="'/edit-space/' + space.email" class="btn btn-primary btnMargin">Edit</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleSpace from './ScheduleSpace'

export default {
  name: 'Booked',
  components: {
    'ScheduleSpace': ScheduleSpace
  },
  data () {
    return {
      bookedEmails: [],
      prevBookedSpaces: [],
      attributesLength: 0,
      scheduleName: '',
      scheduleEmail: ''
    }
  },
  mounted () {
    document.title = 'Previously Booked Spaces'
    // remove search criteria storage
    this.$store.clearDates()
    this.$store.removeSearchCriteria()
    this.bookedEmails = JSON.parse(localStorage.getItem('bookedEmails'))
    if (this.bookedEmails) {
      for (var i = 0; i < this.bookedEmails.length; i++) {
        this.searchByEmail(this.bookedEmails[i])
      }
    }
  },
  methods: {
    searchByEmail (email) {
      var searchUrl = this.$searchUrl + '/' + email
      this.$http.get(searchUrl, email, {
        headers: this.$defaultHeaders
      }).then(result => {
        var space = result.body._source.space
        // get the maximum attributes length
        this.attributesLength = Math.max(this.attributesLength, space.attributes.length)
        this.prevBookedSpaces.push({
          email: email,
          name: space.name,
          description: space.description,
          capacity: space.capacity,
          attributes: space.attributes ? space.attributes : [],
          image: space.image,
          longAttrList: space.attributes.length > 5
        })
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
