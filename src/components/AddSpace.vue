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
            <path class="path1" :d="this.$cameraIcon"></path>
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
      hasErrors: false,
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
    uploadImage () {
      this.emailError = ''
      this.nameError = ''
      this.hasErrors = false

      // verify that name and image are present
      if (!this.name.length) {
        this.nameError = 'The name field is required'
        this.hasErrors = true
      }
      if (!this.hasImage) {
        this.imageError = 'You must add an image'
        this.hasErrors = true
      }

      // if no email was provided & there were no errors, submit the upload
      if (!this.email) {
        if (!this.hasErrors) {
          this.submitUpload()
        }
        return
      }

      // check if a valid email format was provided
      if (!this.$emailRegExp.test(this.email.toLowerCase())) {
        this.emailError = 'Please enter a valid email address'
        return
      }

      // check if another space is already using this email id
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
      axios.post(this.$searchUrl + '/_search', jsonData, {
        headers: this.$defaultHeaders
      }).then(result => {
        let keys = result.data.aggregations.uniq_attrs.buckets
        let spaceIdList = []
        Object.assign(spaceIdList, ...Object.values(keys).map(k => spaceIdList.push(k.key)))
        if (spaceIdList.indexOf(this.email) !== -1) {
          this.emailError = 'A space is already using this email'
          return
        }

        // check if the email exists and that its calendar is not set to private
        axios.get(this.$googleCalendarUrl + this.email, {
          headers: this.$defaultHeaders
        }).then(result => {
          // now that all email checks have passed, submit the upload if there were no errors elsewhere
          if (!this.hasErrors) {
            this.submitUpload()
          }
        }, error => {
          if (error.response.status === 400) {
            this.emailError = 'The given email does not exist or its calendar is set to private'
          } else {
            console.log(error)
            this.emailError = 'An error has occured checking if the email\'s calendar is set to private'
          }
        })
      }, error => {
        console.log(error)
        this.emailError = 'An error has occured checking if a space is already using this email'
      })
    },

    submitUpload () {
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
