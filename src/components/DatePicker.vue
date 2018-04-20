<template>
  <div>
    <date-picker v-model="startDate" lang="en" :not-before="new Date()"></date-picker>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  props: ['date'],
  data () {
    return {
      startDate: new Date(),
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
    date (newDate) {
      this.startDate = newDate
    },
    /** The following code triggers when user selects/removes
    * a date in the date-picker. This code then notifies the parent
    * component of the date change via 'change' event.
    */
    startDate (newDate) {
      //  Check whether given value is a proper date
      //  See: https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
      if (typeof newDate.getMonth !== 'function') {
        //  if user has not selected a date, then default to today
        newDate = new Date()
      }
      this.$emit('change', newDate)
    }
  }
}
</script>
