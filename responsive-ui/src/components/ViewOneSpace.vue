<template>
  <div class="main">
    <h1>{{space.name}}</h1>
    <div class="viewOneImgCol">
      <img :src="space.image" :alt="space.name + 'image'" class="img-fluid img-thumbnail">
    </div>
    <div class="roomInfo">
      <!-- <a href="#" class="btn btn-primary viewOneLink" v-on:click="bookSpace()">Set up meeting</a> -->
      <a href="#" class="btn btn-primary viewOneLink" v-on:click="bookSpace()">Set up meeting</a>
      <a :href="'/edit-space/' + spaceEmail" class="btn btn-primary viewOneLink editBtn">Edit Space</a>
      <p><strong>Description: </strong>{{space.description}}</p>
      <p><strong>Capacity: </strong>{{space.capacity}}</p>
      <div class="viewOneCapacityCol">
        <p><strong>Themes:</strong></p>
          <div v-if="space.themes.length == 0">
            <p>No themes have been added to this space yet.</p>
          </div>
          <div v-else>
            <ul class="themesList">
              <li v-for="theme in space.themes" :key="theme">{{theme}}</li>
            </ul>
          </div>
        </div>
        <div class="viewOneAttrCol">
          <p><strong>Attributes:</strong></p>
          <div v-if="space.attributes.length == 0">
            <p>No attributes have been added to this space yet.</p>
          </div>
          <div v-else>
            <ul class="attributesList">
              <li v-for="attribute in space.attributes" :key="attribute">{{attribute}}</li>
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
      spaceEmail: this.$route.params.spaceId,
      space: {attributes: [], themes: []}
    }
  },
  mounted () {
    document.title = 'View Space'
    this.createElasticSearchUrl()
    this.searchByEmail(this.spaceEmail)
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
        var spaceObj = {
          name: spaceBody.name,
          description: spaceBody.description,
          image: spaceBody.image,
          capacity: spaceBody.capacity,
          attributes: spaceBody.attributes,
          themes: spaceBody.themes
        }
        this.space = spaceObj
      }, error => {
        console.error(error)
      })
    },
    bookSpace () {
      var bookedEmails = JSON.parse(localStorage.getItem('bookedEmails'))
      if (bookedEmails == null) {
        bookedEmails = [this.spaceEmail]
      } else {
        if (!bookedEmails.includes(this.spaceEmail)) {
          bookedEmails.push(this.spaceEmail)
        }
      }
      localStorage.setItem('bookedEmails', JSON.stringify(bookedEmails))

      // try to schedule a meeting
      this.$router.push({
        name: 'ScheduleSpace',
        params: {spaceEmail: this.spaceEmail}
      })
    }
  }
}
</script>
