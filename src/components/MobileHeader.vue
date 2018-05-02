<template>
    <div class="mobile-header-full">
        <div class="mobile-header">
            <router-link to="/">
            <img class="logo" src="/static/images/logo-small.png" alt="Meet Anywhere Logo. ">
                <h3 class="empheading-mobile">Meet Anywhere</h3>
                <p class="empsubheading-mobile">The right meeting space for any situation</p>
            </router-link>
        </div>
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
