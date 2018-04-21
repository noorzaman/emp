<template>
  <date-picker v-model="date" lang="en" :not-before="new Date()"></date-picker>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  props: ['date_prop'],
  data () {
    return {
      date: new Date()
      // shortcuts: [
      //   {
      //     text: 'Today',
      //     start: new Date(),
      //     end: new Date(),
      //     lang: 'en'
      //   }
      // ]
    }
  },
  watch: {
    date_prop (date) {
      this.date = date
    },
    /** The following code triggers when user selects/removes
    * a date in the date-picker. This code then notifies the parent
    * component of the date change via 'change' event.
    */
    date (date) {
      //  if user has de-selected the date, then default to today
      if (!date) {
        date = new Date()
      }
      this.$emit('change', date)
    }
  }
}
</script>
