<template>
  <NotFound v-if="notFound"></NotFound>
  <div v-else class="main viewOnePage">
    <h1>{{name}}</h1>
    <ScheduleSpace :email="email" :name="name" ref="scheduleSpace"></ScheduleSpace>
    <div class="viewOneImgCol">
      <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
    </div>
    <div class="roomInfo">
      <button class="btn btn-primary viewOneLink" @click="submitGoogleCalForm">Set up meeting</button>
      <router-link :to="'/edit-space/' + email" class="btn btn-primary viewOneLink editBtn">Edit Space</router-link>

      <p v-if="description"><strong>Description: </strong>{{description}}</p>
      <p><strong>Capacity: </strong>{{capacity}}</p>
      <div class="viewOneCapacityCol">
        <p><strong>Themes:</strong></p>
          <div v-if="!themes.length">
            <p>No themes have been added to this space yet.</p>
          </div>
          <div v-else>
            <div v-for="item in themes" :key="item" class="tag is-info viewTag" style="margin-right: 2px">
              <span>{{item}}</span>
            </div>
          </div>
        </div>
        <div class="viewOneAttrCol">
          <p><strong>Attributes:</strong></p>
          <div v-if="!attributes.length">
            <p>No attributes have been added to this space yet.</p>
          </div>
          <div v-else>
            <div v-for="item in attributes" :key="item" class="tag is-info viewTag" style="margin-right: 2px">
              <span>{{item}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="clearFix"></div>
  </div>
</template>

<script>
import NotFound from './NotFound'
import ScheduleSpace from './ScheduleSpace'

export default {
  name: 'ViewOneSpace',
  components: {
    'NotFound': NotFound,
    'ScheduleSpace': ScheduleSpace
  },
  data () {
    return {
      notFound: false,
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
      var searchUrl = this.$searchUrl + '/' + this.email
      this.$http.get(searchUrl, {
        headers: this.$defaultHeaders
      }).then(result => {
        var space = result.body._source.space
        this.imageData = space.image
        this.name = space.name
        this.description = space.description
        this.capacity = space.capacity
        this.attributes = space.attributes ? space.attributes : []
        this.themes = space.themes ? space.themes : []
        if (this.capacity === 50) {
          this.capacity += '+'
        }
      }, error => {
        console.error(error)
        this.notFound = true
      })
    },
    /**
    * Submit Google Calendar form
    */
    submitGoogleCalForm () {
      this.$refs.scheduleSpace.submitForm()
    }
  }
}
</script>

<style scoped>
</style>
