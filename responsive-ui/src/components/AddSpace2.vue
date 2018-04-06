<template>
  <div class="main">

    <h1 class="pageTitle">{{pageTitle}}</h1>

    <div class="row">
      <!-- <div class = "col-lg-5 col-md-6 col-sm-7 col-xs-8" v-if="imageData.length"> -->
      <div>
        <img :src="imageData" :alt="name + ' image'" class="img-fluid img-thumbnail">
      </div>
      <div>
        <input class="fileChooserButton" type="file" accept="image/*" @change="previewImage">
      </div>
      <br>
    </div>
    <div class="form-group">
      <label class="empLabel">*Space name</label>
      <br>
      <input class="empText" type="text" placeholder="Meeting place name (required)" v-model="name">
      <p class="text-danger">{{nameError}}</p>
    </div>
    <div class="form-group">
      <label class="empLabel" >Space e-mail</label>
      <br>
      <input class="empText" type="email" placeholder="Meeting place email" v-model="email"><br>
      <p class="text-danger">{{emailError}}</p>
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
      imageData: 'https://s3.amazonaws.com/empstorage/placeholder.jpeg',
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
.pageTitle {
  font-family: 'Hoefler Text', Georgia, 'Times New Roman', serif;
  font-weight: normal;
  font-size: 1.75em;
  color: rgb(95, 78, 194);
  font-size: 16px;
  letter-spacing: .2em;
  line-height: 1.1em;
  margin:0px;
  text-align: left;
  text-transform: uppercase;
  margin-bottom: 10px;
}

img {
    display: block;
    margin-left: 10px;
    margin-right: auto;
    width: 80%;
}
.fileChooserButton {
    width: 80%;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    background-color: #4CAF50;
    /* border-radius: 15px; */
    box-shadow: 0 3px #999;
    margin-left:10px;
    margin-right:auto;
}
.empLabel {
    margin-left:0px;
    font-size: 16px;
}
.empText {
  width: 70%;
  font-size: 16px;
}

</style>
