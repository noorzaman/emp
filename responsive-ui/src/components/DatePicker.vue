<template>
  <div>
    <date-picker v-model="startDate" lang="en" :not-before="new Date()"></date-picker>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data () {
    return {
      startDate: null,
      shortcuts: [
        {
          text: 'Today',
          start: new Date(),
          end: new Date(),
          lang: 'en'
        }
      ]
    }
  },
  watch: {

    /** The following code triggers when user selects/ removes
    * a date in the date-picker. This code then notifies the parent
    * component of the date change via 'change' event.
    */
    startDate: function (newDate) {
      //  Check whether given value is a proper date
      //  See: https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
      if (typeof newDate.getMonth === 'function') {
        this.$emit('change', newDate)
      } else {
        //  When user removes a date from date-picker then 'newDate'
        //  will not be a date object. Let's notify the parent so
        //  that parent can update its state.
        this.$emit('change', null)
      }
    }
  }
}
</script>
