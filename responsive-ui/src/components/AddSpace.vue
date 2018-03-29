<template>
  <div class="main">
    <h1>{{pageTitle}}</h1><br>
    <div class="form-group">
      <label class="empLabel">*Space name</label>
      <br>
      <input class="empText" type="text" v-model="name">
      <p class="text-danger">{{nameError}}</p>
    </div>
    <div class="form-group">
      <label class="empLabel" >Space e-mail</label>
      <br>
      <input class="empText" type="email" v-model="email"><br>
      <p class="text-danger">{{emailError}}</p>
    </div>
    <image-uploader
      hidden=true
      :debug="1"
      :maxSize="1"
      :maxWidth="512"
      :maxHeight="512"
      :quality="0.9"
      :autoRotate=true
      outputFormat="string"
      @input="setImage">
    </image-uploader>
    <label for="fileInput" slot="upload-label">
      <figure style="margin-left:50px">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path class="path1" d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"></path>
        </svg>
      </figure>
      <span>{{ hasImage ? 'Replace Image' : 'Capture Image' }}</span>
    </label>
    <p class="text-danger">{{imageError}}</p>
    <div class="row">
      <div class = "col-lg-5 col-md-6 col-sm-7 col-xs-8" v-if="hasImage">
        <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
      </div>
    </div>
    <br><br>
    <button class="btn btn-primary" @click="checkForm">Upload photo</button>
  </div>
</template>

<script>
import { ImageUploader } from 'vue-image-upload-resize'

export default {
  name: 'AddSpace',
  data () {
    return {
      pageTitle: 'Add a New Space',
      pageWidth: document.documentElement.clientWidth,
      name: '',
      email: '',
      imageData: '',
      hasImage: false,
      nameError: '',
      emailError: '',
      imageError: ''
    }
  },
  components: {
    ImageUploader
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
      if (!this.hasImage) {
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
    },
    setImage (img) {
      this.imageError = ''
      this.hasImage = true
      this.imageData = img
    }
  }
}
</script>

<style scoped>
</style>
