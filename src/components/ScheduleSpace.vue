<template>
  <form hidden name="googleCalForm" method="GET" action="https://calendar.google.com/calendar/r/eventedit">
    <input name="add" :value="email"/>
    <input name="location" :value="name"/>
    <input v-if="date" name="dates" :value="time"/>
  </form>
</template>

<script>
export default {
  name: 'ScheduleSpace',
  props: ['email', 'name'],
  data () {
    return {
      date: false,
      startTime: false,
      endTime: false
    }
  },
  computed: {
    time () {
      // return time string of the format 'YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS'
      if (this.date) {
        var month = this.addPadding((this.date.getMonth() + 1))
        var day = this.addPadding(this.date.getDate())
        var date = this.date.getFullYear() + month + day
        var startTime = this.addPadding(this.startTime.getHours()) +
          this.addPadding(this.startTime.getMinutes()) + '00'
        var endTime = this.addPadding(this.endTime.getHours()) +
          this.addPadding(this.endTime.getMinutes()) + '00'
        return date + 'T' + startTime + '/' + date + 'T' + endTime
      }
      return false
    }
  },
  methods: {
    /**
    * Submits the form to open Google Calendar
    */
    submitForm () {
      // get date and time information
      this.date = this.$store.state.date
      this.startTime = this.$store.state.startTime
      this.endTime = this.$store.state.endTime
      // remove search criteria storage
      this.$store.removeSearchCriteria()
      this.$nextTick(function () {
        // add this space to list of booked spaces
        this.updateListOfBookedSpaces(this.email)
        // and submit the form
        // document.googleCalForm.submit()
      })
    },
    addPadding (number) {
      var string = number.toString()
      var pad = '00'
      return pad.substring(0, pad.length - string.length) + string
    },
    /** This method adds given space email address
    * to list of booked spaces. This list of booked
    * spaces is persisted on local storage.
    */
    updateListOfBookedSpaces (email) {
      var bookedSpaces = JSON.parse(localStorage.getItem('bookedEmails'))
      if (bookedSpaces == null) {
        localStorage.setItem('bookedEmails', JSON.stringify([email]))
      } else if (!bookedSpaces.includes(email)) {
        if (bookedSpaces.length >= this.$maxResultsShown) {
          bookedSpaces.shift()
        }
        bookedSpaces.push(email)
        localStorage.setItem('bookedEmails', JSON.stringify(bookedSpaces))
      }
    }
  }
}
</script>
