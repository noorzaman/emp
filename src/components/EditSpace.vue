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
          <label>* Space name</label><br>
          <input type="text" v-model="name" id="name" maxLength="20"><br>
          <div class="text-danger">{{nameError}}</div>
        </div>
        <div class="form-group">
          <label>Space e-mail</label><br>
          <p id="spaceId">{{this.email}}</p>
        </div>
        <div class="row">
          <div class = "col-lg-10 col-md-10 col-sm-10 col-xs-10">
            <img :src="image" :alt="name + ' image'" class="img-fluid img-thumbnail">
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
          <NumberSlider v-on:change="capacityChanged" :allowAny="false" :capacity_prop="capacity"></NumberSlider>
        </div>
        <div class="form-group themes">
          <label>Themes</label><br>
          <ul class="checkbox-grid">
            <li v-for="theme in $possibleThemes" :key="theme">
              <input type="checkbox" name="themeCheckbox" :value="theme" :id="theme" v-model="themes"/>
              <label :for="theme" class="checkboxLabel">{{theme.charAt(0).toUpperCase() + theme.slice(1)}}</label>
            </li>
          </ul>
        </div>
        <div class="form-group typeAhead">
          <TypeAhead :selectedAttributes="attributes" :allowCustom="true"></TypeAhead>
        </div>
      </div>
      <button class="btn btn-primary submitButton" v-on:click="editSpace" id="save-btn">Save</button>
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
      image: '',
      name: '',
      description: '',
      capacity: 1,
      themes: [],
      attributes: [],
      uploading: false,
      nameError: ''
    }
  },
  mounted () {
    document.title = 'Edit Space'
    // remove search criteria storage
    this.$store.removeSearchCriteria()
    this.searchByEmail()
  },
  methods: {
    /** Is called when capacity slider changes
    */
    capacityChanged (capacity) {
      this.capacity = capacity
    },
    searchByEmail () {
      var searchUrl = this.$searchUrl + '/' + this.email
      this.$http.get(searchUrl, {
        headers: this.$defaultHeaders
      }).then(result => {
        var space = result.body._source.space
        this.image = space.image
        this.name = space.name
        this.description = space.description
        this.capacity = space.capacity
        this.attributes = space.attributes ? space.attributes : []
        this.filterAttributes()
        this.themes = space.themes ? space.themes : []
      }, error => {
        console.error(error)
        this.notFound = true
      })
    },
    editSpace () {
      var hasErrors = false
      if (!this.name.length) {
        this.nameError = 'The name field is required'
        hasErrors = true
      } else if (this.name.length > 20) {
        this.nameError = 'The name field can have maximum 20 characters'
        hasErrors = true
      } else {
        this.nameError = ''
      }
      if (hasErrors) {
        return
      }

      this.uploading = true

      var data = {
        'spaceId': this.email,
        'space': {
          'name': this.name,
          'description': this.description,
          'capacity': this.capacity,
          'themes': this.themes,
          'attributes': this.attributes
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
    },
    filterAttributes () {
      if (this.$maxAttributes < 1) {
        return
      }
      if (this.attributes.length > this.$maxAttributes) {
        this.attributes = this.attributes.slice(0, this.$maxAttributes)
      }
    }
  }
}
</script>

<style scoped>
</style>
