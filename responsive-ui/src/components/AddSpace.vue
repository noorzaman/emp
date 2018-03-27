<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
    <div class="form-group">
      <label>*Space name</label><br>
      <input type="text" v-model="name">
      <p class="text-danger">{{nameError}}</p>
    </div>
    <div class="form-group">
      <label>Space e-mail</label><br>
      <input type="email" v-model="email"><br>
      <p class="text-danger">{{emailError}}</p>
    </div>
    <div class="row">
      <div>
        <input type="file" accept="image/*" @change="previewImage">
      </div>
      <div class = "col-lg-5 col-md-6 col-sm-7 col-xs-8" v-if="imageData.length">
        <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
      </div>
    </div>
    <p class="text-danger">{{imageError}}</p>
    <br>
    <button class="btn btn-primary" @click="checkForm">Upload photo</button>
  </div>
</template>

<script>
export default {
  name: 'AddSpace',
  data () {
    return {
      pageTitle: 'Add a New Space',
      pageWidth: document.documentElement.clientWidth,
      name: '',
      email: '',
      imageData: '',
      nameError: '',
      emailError: '',
      imageError: ''
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted () {
    document.title = 'Add Space'
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // whenever the document is resized, re-set the 'pageWidth' variable
    handleResize (event) {
      this.pageWidth = document.documentElement.clientWidth
    },
    previewImage (event) {
      this.imageError = ''
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
    checkForm () {
      var isError = false
      if (!this.name.length) {
        this.nameError = 'The name field is required'
        isError = true
      } else {
        this.nameError = ''
      }
      if (this.email.length && !this.validEmail(this.email)) {
        this.emailError = 'Please enter a valid email address'
        isError = true
      } else {
        this.emailError = ''
      }
      if (!this.imageData.length) {
        this.imageError = 'You must add an image'
        isError = true
      } else {
        this.imageError = ''
      }
      if (!isError) {
        this.uploadPhoto()
      }
    },
    validEmail (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    uploadPhoto () {
      var data = {
        'placeId': this.email,
        'data': this.imageData,
        'space': {
          'name': this.name
        }
      }
      var jsonData = JSON.stringify(data)
      var url = 'https://txdydq8h71.execute-api.us-east-1.amazonaws.com/development/streams/tmp/record2'

      this.$http.put(url, jsonData, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        this.$router.push('/edit-space/' + this.email)
      }, error => {
        console.error(error)
        this.$router.push('/edit-space/' + this.email)
      })
    }
  }
}
</script>

<style scoped>
</style>
