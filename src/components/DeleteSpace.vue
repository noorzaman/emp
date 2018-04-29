<template>
  <div class="main">
    {{ spaceId }} {{ message }}
  </div>
</template>

<script>
export default {
  name: 'DeleteSpace',
  components: {
  },
  data () {
    return {
      message: 'is being processed',
      spaceId: this.$route.params.spaceId
    }
  },
  mounted () {
    this.deleteSpace()
  },
  methods: {
    deleteSpace () {
      var searchUrl = this.$searchUrl + '/' + this.spaceId
      this.$http.delete(searchUrl, {
        headers: this.$defaultHeaders
      }).then(result => {
        this.message = 'deleted'
      }, error => {
        console.error(error)
        this.message = 'not found'
      })
    }
  }
}
</script>

<style scoped>
</style>
