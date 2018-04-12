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
    * component of the change via 'change' event.
    */
    time: function (newValue) {
      this.$emit('change', newValue)
    }
  }
}
</script>
<!-- time-picker-example.vue -->
