<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
    <div class="row">
      <div>
        <input type="file" accept="image/*" @change="previewImage">
      </div>
      <div class = "col-lg-5 col-md-6 col-sm-7 col-xs-8" v-if="imageData.length > 0">
        <img :src="imageData" class="img-fluid img-thumbnail bookedImg">
      </div>
    </div>
    <br>
    <button class="btn btn-primary" v-on:click="uploadPhoto">Upload photo</button>
    <br><br>
    <div class="form-group">
      <label>Space e-mail</label><br>
      <input type="email" v-model="email"><br>
    </div>
    <div class="form-group">
      <label>Space name</label><br>
      <input type="text" v-model="name"><br>
    </div>
    <div class="form-group">
      <label>Description</label><br>
      <input type="text" v-model="description"><br>
    </div>
    <div class="form-group">
      <Label>Capacity</label>
      <NumberSlider></NumberSlider>
    </div>
    <div class="form-group themes">
      <label>Themes</label> <br>
      <ul class="checkbox-grid">
        <li><input type="checkbox" name="themeCheckbox" value="casual" />Casual</li>
        <li><input type="checkbox" name="themeCheckbox" value="celebratory" />Celebratory</li>
        <li><input type="checkbox" name="themeCheckbox" value="cozy" />Cozy</li>
        <li><input type="checkbox" name="themeCheckbox" value="fancy" />Fancy</li>
        <li><input type="checkbox" name="themeCheckbox" value="fun" />Fun</li>
        <li><input type="checkbox" name="themeCheckbox" value="lively" />Lively</li>
        <li><input type="checkbox" name="themeCheckbox" value="modern" />Modern</li>
        <li><input type="checkbox" name="themeCheckbox" value="professional" />Professional</li>
        <li><input type="checkbox" name="themeCheckbox" value="quiet" />Quiet</li>
        <li><input type="checkbox" name="themeCheckbox" value="rustic" />Rustic</li>
        <li><input type="checkbox" name="themeCheckbox" value="studious" />Studious</li>
        <li><input type="checkbox" name="themeCheckbox" value="zen" />Zen</li>
      </ul>
    </div>
    <div class="form-group typeAhead">
      <TypeAhead></TypeAhead>
    </div>
    <button class="btn btn-primary" v-on:click="addSpace">Add space</button>
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
      pageTitle: 'Add a New Space',
      pageWidth: document.documentElement.clientWidth,
      imageData: '',
      email: '',
      name: '',
      description: ''
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    },
    previewImage (event) {
      // Reference to the DOM input element
      var input = event.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
      }
    },
    uploadPhoto () {
      console.log('upload photo')
    },
    addSpace () {
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
        },
        'data': this.imageData
      }
      var jsonData = JSON.stringify(data)
      // console.log(jsonData)

      var url = 'https://txdydq8h71.execute-api.us-east-1.amazonaws.com/development/streams/tmp/record2'

      this.$http.put(url, jsonData, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        console.log(result)
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
