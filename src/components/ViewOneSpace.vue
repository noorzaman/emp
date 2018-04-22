<template>
  <NotFound v-if="notFound"></NotFound>
  <div v-else class="main">
    <h1>{{name}}</h1>
    <div class="viewOneImgCol">
      <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
    </div>
    <div class="roomInfo">
      <router-link :to="'/schedule-space/' + email + '/' + name" class="btn btn-primary viewOneLink">Set up meeting</router-link>
      <router-link :to="'/edit-space/' + email" class="btn btn-primary viewOneLink editBtn">Edit Space</router-link>

      <p v-if="description"><strong>Description: </strong>{{description}}</p>
      <p><strong>Capacity: </strong>{{capacity}}</p>
      <div class="viewOneCapacityCol">
        <p><strong>Themes:</strong></p>
          <div v-if="!themes.length">
            <p>No themes have been added to this space yet.</p>
          </div>
          <div v-else>
            <ul class="themesList">
              <li v-for="theme in themes" :key="theme">{{theme}}</li>
            </ul>
          </div>
        </div>
        <div class="viewOneAttrCol">
          <p><strong>Attributes:</strong></p>
          <div v-if="!attributes.length">
            <p>No attributes have been added to this space yet.</p>
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
import NotFound from './NotFound'

export default {
  name: 'ViewOneSpace',
  components: {
    'NotFound': NotFound
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
        this.attributes = space.attributes ? space.attributes : []
        this.themes = space.themes ? space.themes : []
        this.capacity = space.capacity ? space.capacity : 1
        if (this.capacity === 50) {
          this.capacity += '+'
        }
      }, error => {
        console.error(error)
        this.notFound = true
      })
    }
  }
}
</script>

<style scoped>
</style>
