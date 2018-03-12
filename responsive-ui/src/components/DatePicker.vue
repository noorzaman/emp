<template>
  <div>
    <date-picker v-model="time1" lang="en" :not-before="new Date()"></date-picker>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data () {
    return {
      time1: '',
      time2: '',
      shortcuts: [
        {
          text: 'Today',
          start: new Date(),
          end: new Date(),
          lang: 'en'
        }
      ]
    }
  }
}
</script>
