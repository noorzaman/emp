<template>
    <time-picker v-model="time"/>
</template>
<script>
export default {
  data () {
    return {
      time: new Date('')
    }
  },
  watch: {

    /** The following code triggers when user selects/ changes
    * time in the time-picker. This code then notifies the parent
    * component of the change via 'change' event. Parent should
    * expect HH:MM format. Example: 23:59
    */
    time: function (newValue) {
      this.$emit('change', newValue.getHours() + ':' + newValue.getMinutes())
    }
  }
}
</script>
<!-- time-picker-example.vue -->
