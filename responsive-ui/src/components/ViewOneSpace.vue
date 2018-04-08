<template>
  <div class="main">
    <h1>{{name}}</h1>
    <div class="viewOneImgCol">
      <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
    </div>
    <div class="roomInfo">
      <a href="#" class="btn btn-primary viewOneLink" v-on:click="bookSpace()">Set up meeting</a>
      <a :href="'/edit-space/' + email" class="btn btn-primary viewOneLink editBtn">Edit Space</a>
      <p><strong>Description: </strong>{{description}}</p>
      <p><strong>Capacity: </strong>{{capacity}}</p>
      <div class="viewOneCapacityCol">
        <p><strong>Themes:</strong></p>
          <div v-if="themes.length == 0">
            <p>No themes have been added to this space yet.</p>
          </div>
          <div v-else>
            <ul class="themesList">
              <li v-for="theme in themes" :key="theme">{{theme}}</li>
            </ul>
          </div>
        </div>
        <div class="viewOneAttrCol">
          <p><strong>Tags:</strong></p>
          <div v-if="attributes.length == 0">
            <p>No tags have been added to this space yet.</p>
          </div>
          <div v-else>
            <ul class="browseAttributesList">
              <li v-for="attribute in attributes" :key="attribute">{{attribute}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="clearFix"></div>
  </div>
</template>

<script>
export default {
  name: 'ViewOneSpace',
  data () {
    return {
      email: this.$route.params.spaceId,
      attributes: [],
      themes: [],
      imageData: '',
      name: '',
      description: '',
      capacity: 0
    }
  },
  mounted () {
    document.title = 'View Space'
    this.searchByEmail()
  },
  methods: {
    searchByEmail () {
      var empUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms'
      var searchUrl = empUrl + '/' + this.email
      this.$http.get(searchUrl, this.email, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var space = result.body._source.space
        this.imageData = space.image
        this.name = space.name
        this.description = space.description
        this.attributes = space.attributes
        this.themes = space.themes
        this.capacity = space.capacity
      }, error => {
        console.error(error)
      })
    },
    bookSpace () {
      console.log('this.email: ' + this.email)
      var bookedEmails = JSON.parse(localStorage.getItem('bookedEmails'))
      if (bookedEmails == null) {
        bookedEmails = [this.email]
      } else {
        if (!bookedEmails.includes(this.email)) {
          bookedEmails.push(this.email)
        }
      }
      console.log('bookedEmails: ' + bookedEmails)
      localStorage.setItem('bookedEmails', JSON.stringify(bookedEmails))

      // try to schedule a meeting
      this.$router.push({
        name: 'ScheduleSpace',
        params: {spaceEmail: this.email}
      })
    }
  }
}
</script>
