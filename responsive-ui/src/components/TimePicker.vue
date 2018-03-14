<template>
    <time-picker v-model="time"/>
</template>
<script>
export default {
  data () {
    return {
      time: new Date('')
    }
  }
}
</script>
<!-- time-picker-example.vue -->
