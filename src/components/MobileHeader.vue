<template>
    <div class="mobile-header">
        <router-link to="/"><img class="logo" src="/static/images/meeting-logo.png" alt="Meet Anywhere Logo. "></router-link>
        <h3 class="empheading">Meet Anywhere</h3>
        <p class="empsubheading">The right meeting space for any situation</p>
    </div>
</template>

<script>
export default {
  name: 'MobileHeader',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
</style>
