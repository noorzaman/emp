<!-- https://uiv.wxsm.space/time-picker/#example -->

<template>
  <time-picker v-model="time"/>
</template>

<script>
export default {
  props: ['time_prop'],
  data () {
    return {
      time: new Date('') // empty fields
    }
  },
  watch: {
    time_prop (time) {
      this.time = time
    },
    /** The following code triggers when user selects/ changes
    * time in the time-picker. This code then notifies the parent
    * component of the change via 'change' event.
    */
    time (time) {
      this.$emit('change', time)
    }
  }
}
</script>

<style scoped>
</style>
