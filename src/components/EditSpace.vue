<template>
  <NotFound v-if="notFound"></NotFound>
  <div v-else class="main">
    <h1>{{pageTitle}}</h1>
    <div v-if="this.uploading">
      <p>Saving...</p>
    </div>
    <div v-else>
      <br>
      <div class="leftSearch">
        <div class="form-group">
          <label>Space name</label><br>
          <input type="text" v-model="name"><br>
        </div>
        <div class="form-group">
          <label>Space e-mail</label><br>
          <p>{{this.email}}</p>
        </div>
        <div class="row">
          <div class = "col-lg-10 col-md-10 col-sm-10 col-xs-10">
            <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
          </div>
        </div>
        <br>
        <div class="form-group">
          <label>Description</label><br>
          <textarea style="width:80%" rows="5" placeholder="Enter the description" v-model="description"></textarea><br>
        </div>
      </div>

      <div class="rightSearch">
        <div class="form-group">
          <Label>Capacity</label>
          <NumberSlider v-bind:capacity="capacity"></NumberSlider>
        </div>
        <div class="form-group themes">
          <label>Themes</label><br>
          <ul class="checkbox-grid">
            <li v-for="theme in possibleThemes" :key="theme">
              <input type="checkbox" name="themeCheckbox" :value="theme" :id="theme" v-model="themes"/>
              <label :for="theme" class="checkboxLabel">{{theme.charAt(0).toUpperCase() + theme.slice(1)}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group typeAhead">
          <TypeAhead v-bind:selectedAttributes="tags" v-bind:allowCustom="true"></TypeAhead>
        </div>
      </div>
      <button class="btn btn-primary submitButton" v-on:click="editSpace">Save</button>
    </div>
  </div>
</template>

<script>
import NotFound from './NotFound'
import NumberSlider from './NumberSlider'
import TypeAhead from './TypeAhead'

export default {
  name: 'AddSpace',
  components: {
    'NotFound': NotFound,
    'NumberSlider': NumberSlider,
    'TypeAhead': TypeAhead
  },
  data () {
    return {
      notFound: false,
      pageTitle: 'Edit Space',
      email: this.$route.params.spaceId,
      calendarId: '',
      imageData: '',
      name: '',
      description: '',
      tags: [],
      themes: [],
      capacity: 0,
      uploading: false,
      possibleThemes: [
        'casual',
        'celebratory',
        'cozy',
        'fancy',
        'fun',
        'lively',
        'modern',
        'professional',
        'quiet',
        'rustic',
        'studious',
        'zen'
      ]
    }
  },
  mounted () {
    document.title = 'Edit Space'
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
        this.tags = space.attributes
        this.themes = space.themes ? space.themes : []
        this.capacity = space.capacity
      }, error => {
        console.error(error)
        this.notFound = true
      })
    },
    editSpace () {
      this.uploading = true
      var attributes = []
      var options = document.getElementsByClassName('attr')
      for (var i = 0; i < options.length; i++) {
        attributes.push(options[i].innerText)
      }

      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      }

      var data = {
        'spaceId': this.email,
        'space': {
          'name': this.name,
          'description': this.description,
          'capacity': parseInt(desiredCapacity),
          'themes': this.themes,
          'attributes': attributes
        }
      }
      var jsonData = JSON.stringify(data)

      this.$http.put(this.$editUrl, jsonData, {
        headers: this.$defaultHeaders
      }).then(result => {
        this.$router.push('/space/' + this.email)
      }, error => {
        console.error(error)
        this.uploading = false
        alert('Saving your edits failed.')
      })
    }
  }
}
</script>

<style scoped>
</style>
