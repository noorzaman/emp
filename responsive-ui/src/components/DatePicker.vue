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
    * component of the date change via 'change' event. Parent should
    * expect an ISO date. Example: 2018-12-25
    */
    startDate: function (newDate) {
      //  Check whether given value is a proper date
      //  See: https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
      if (typeof newDate.getMonth !== 'function') {
        //  if user has not selected a date, then default to today
        newDate = new Date()
      }
      var month = newDate.getMonth() + 1
      var isoDate = newDate.getFullYear() + '-' + month + '-' + newDate.getDate()
      this.$emit('change', isoDate)
    }
  }
}
</script>
