<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
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
          <img :src="imageData" :alt="'image'" class="img-fluid img-thumbnail">
        </div>
      </div>
      <br>
      <div class="form-group">
        <label>Description</label><br>
        <textarea style="width:80%" rows="5" placeholder="Enter the description" v-model="description"></textarea><br>
      </div>
      <div class="form-group">
        <Label>Capacity</label>
        <NumberSlider></NumberSlider>
      </div>
    </div>

    <div class="rightSearch">
      <div class="form-group themes">
        <label>Themes</label> <br>
        <ul class="checkbox-grid">
          <li><input type="checkbox" name="themeCheckbox" value="casual" id="casual"/>
            <label for="casual" class="checkboxLabel">Casual</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="celebratory" id="celebratory"/>
            <label for="celebratory" class="checkboxLabel">Celebratory</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="cozy" id="cozy"/>
            <label for="cozy" class="checkboxLabel">Cozy</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="fancy" id="fancy"/>
            <label for="fancy" class="checkboxLabel">Fancy</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="fun" id="fun"/>
            <label for="fun" class="checkboxLabel">Fun</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="lively" id="lively"/>
            <label for="lively" class="checkboxLabel">Lively</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="modern" id="modern"/>
            <label for="modern" class="checkboxLabel">Modern</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="professional" id="professional"/>
            <label for="professional" class="checkboxLabel">Professional</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="quiet" id="quiet"/>
            <label for="quiet" class="checkboxLabel">Quiet</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="rustic" id="rustic"/>
            <label for="rustic" class="checkboxLabel">Rustic</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="studious" id="studious"/>
            <label for="studious" class="checkboxLabel">Studious</label></li>
          <li><input type="checkbox" name="themeCheckbox" value="zen" id="zen"/>
            <label for="zen" class="checkboxLabel">Zen</label></li>
        </ul>
      </div>
      <div class="form-group typeAhead">
        <TypeAhead v-bind:tags="tags"></TypeAhead>
      </div>
    </div>
    <button class="btn btn-primary submitButton" v-on:click="editSpace">Submit edit</button>
  </div>
</template>

<script>
import NumberSlider from './NumberSlider'
import TypeAhead from './TypeAhead'
export default {
  name: 'AddSpace',
  components: {
    'NumberSlider': NumberSlider,
    'TypeAhead': TypeAhead
  },
  data () {
    return {
      pageTitle: 'Edit Space',
      pageWidth: document.documentElement.clientWidth,
      email: this.$route.params.spaceId,
      imageData: '',
      name: '',
      description: '',
      tags: []
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Edit Space'
    window.addEventListener('resize', this.handleResize)
    this.searchByEmail()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    },
    searchByEmail () {
      var search = {
        'query': {
          'term': {
            '_id': this.email
          }
        }
      }
      var jsonStr = JSON.stringify(search)
      var searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?size=50&from=0'

      this.$http.post(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var space = result.body.hits.hits[0]._source.space
        this.imageData = space.image
        this.name = space.name
        this.description = space.description
        this.tags = space.attributes
      }, error => {
        console.error(error)
      })
    },
    editSpace () {
      var themes = []
      var options = document.getElementsByName('themeCheckbox')
      for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
          themes.push(options[i].value)
        }
      }

      var attributes = []
      options = document.getElementsByClassName('attr')
      for (i = 0; i < options.length; i++) {
        attributes.push(options[i].id)
      }

      var desiredCapacity = document.getElementsByClassName('vue-slider-tooltip')[0].innerText
      if (desiredCapacity === null || desiredCapacity === undefined || desiredCapacity === 'Any') {
        desiredCapacity = 0
      }

      var data = {
        'placeId': this.email,
        'space': {
          'name': this.name,
          'description': this.description,
          'capacity': desiredCapacity,
          'themes': themes,
          'attributes': attributes
        }
      }
      var jsonData = JSON.stringify(data)
      var url = 'https://txdydq8h71.execute-api.us-east-1.amazonaws.com/development/streams/tmp/record2'

      this.$http.put(url, jsonData, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        this.$router.push('/space/' + this.email)
      }, error => {
        console.error(error)
        this.$router.push('/space/' + this.email)
      })
    }
  }
}
</script>

<style scoped>
</style>
