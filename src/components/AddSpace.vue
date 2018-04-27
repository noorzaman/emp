<template>
  <div class="main">
    <h1>{{pageTitle}}</h1>
    <div v-if="this.uploading">
      <p>Uploading image...</p>
    </div>
    <div v-else>
      <br>
      <div class="form-group">
        <label class="empLabel">*Space name</label>
        <br>
        <input class="empText" type="text" v-model="name">
        <div class="text-danger">{{nameError}}</div>
      </div>
      <div class="form-group">
        <label class="empLabel">Space e-mail</label>
        <p>Only if your space already has a gmail calendar associated with it</p>
        <input class="empText" type="email" v-model="email"><br>
        <div class="text-danger">{{emailError}}</div>
      </div>
      <image-uploader
        hidden
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
        <figure style="margin-left:45px">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path class="path1" d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"></path>
          </svg>
        </figure>
        <span>{{ hasImage ? 'Replace Image' : 'Capture Image' }}</span>
      </label>
      <div class="text-danger">{{imageError}}</div>
      <div class="row">
        <div class = "col-lg-5 col-md-6 col-sm-7 col-xs-8" v-if="hasImage">
          <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
        </div>
      </div>
      <br><br>
      <button class="btn btn-primary" @click="uploadImage">Upload Image</button>
    </div>
  </div>
</template>

<script>
import { ImageUploader } from 'vue-image-upload-resize'
import axios from 'axios'

export default {
  name: 'AddSpace',
  data () {
    return {
      pageTitle: 'Add a New Space',
      name: '',
      email: '',
      imageData: '',
      hasImage: false,
      nameError: '',
      emailError: '',
      imageError: '',
      uploading: false
    }
  },
  components: {
    ImageUploader
  },
  mounted () {
    document.title = 'Add Space'
    // remove search criteria storage
    this.$store.clearDates()
    this.$store.removeSearchCriteria()
  },
  methods: {
    hasInputErrors () {
      let hasErrors = false
      if (!this.name.length) {
        this.nameError = 'The name field is required'
        hasErrors = true
      } else {
        this.nameError = ''
      }
      if (this.email && !this.validEmail(this.email)) {
        hasErrors = true
      } else {
        this.emailError = ''
      }
      if (!this.hasImage) {
        this.imageError = 'You must add an image'
        hasErrors = true
      }
      return hasErrors
    },
    async validEmail (email) {
      var self = this
      if (!this.$emailRegExp.test(String(email).toLowerCase())) {
        self.emailError = 'Please enter a valid email address'
        return false
      }
      try {
        const response = await axios.get(this.$googleCalendarUrl + email, {
          headers: this.$defaultHeaders
        })
        return response && response.status === 200
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
          self.emailError = 'Given email is set as private. Please, enter a valid email'
          return false
        }
      }
    },
    async uploadImage () {
      // verify proper input
      if (this.hasInputErrors()) {
        return
      }

      // check email uniqueness
      if (this.email) {
        let data = {
          'size': 0,
          'aggs': {
            'uniq_attrs': {
              'terms': {
                'size': 1000,
                'field': '_id'
              }
            }
          }
        }
        let jsonData = JSON.stringify(data)

        const response = await axios.post(this.$searchUrl + '/_search', jsonData, {
          headers: this.$defaultHeaders
        })
        let keys = response.data.aggregations.uniq_attrs.buckets
        let lst = []
        Object.assign(lst, ...Object.values(keys).map(k => lst.push(k.key)))
        if (lst.indexOf(this.email) > -1) {
          this.emailError = 'Room with this email already exists'
          return
        }
      }

      // upload the image
      this.uploading = true
      let data = {
        'data': this.imageData,
        'space': {
          'name': this.name,
          'capacity': 1
        }
      }
      if (this.email) {
        data['spaceId'] = this.email
      }
      let jsonData = JSON.stringify(data)

      axios.put(this.$editUrl, jsonData, {
        headers: this.$defaultHeaders
      }).then(result => {
        this.$router.push('/edit-space/' + result.data.spaceId)
      }, error => {
        console.error(error)
        this.uploading = false
        alert('Uploading your image failed.')
      })
    },
    setImage (img) {
      var imgType = img.split(';')[0].split('/')[1]
      // png and bmp images are labeled as png, jpg and jpeg are labeled as jpeg
      if (imgType !== 'jpeg' && imgType !== 'png') {
        this.imageError = 'Only jpeg, png, and bmp images are supported'
        this.hasImage = false
        this.imageData = ''
      } else {
        this.imageError = ''
        this.hasImage = true
        this.imageData = img
      }
    }
  }
}
</script>

<style scoped>
</style>
