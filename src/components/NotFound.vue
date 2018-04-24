<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="template">
          <h1>Oops!</h1>
          <h2>404 Not Found</h2>
          <div class="details">
            Sorry, an error has occured, requested page not found!
          </div>
          <a href="/" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>&nbsp;&nbsp;Take Me Home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    document.title = '404 Not Found'
    // remove search criteria storage
    this.$store.resetDates()
    this.$store.removeSearchCriteria()
  }
}
</script>

<style scoped>
.template {padding: 40px 15px;text-align: center;}
.details {margin-top:15px;margin-bottom:15px;}
</style>
