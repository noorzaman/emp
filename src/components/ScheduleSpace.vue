<template>
  <form hidden name="googleCalInput" method="GET" action="https://calendar.google.com/calendar/r/eventedit">
    <input name="add" :value="email"/>
    <input name='location' :value="name"/>
    <input v-if="date" name="dates" :value="time"/>
  </form>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      email: this.$route.params.spaceId,
      name: this.$route.params.spaceName,
      date: this.$store.state.date,
      startTime: this.$store.state.startTime,
      endTime: this.$store.state.endTime
    }
  },
  computed: {
    time () {
      // return time string of the format '20180320T204000/20180320T204000'
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
  mounted () {
    // remove search criteria storage
    this.$store.removeSearchCriteria()
    // Let's add this space to list of booked spaces.
    this.updateListOfBookedSpaces(this.email)
    // And redirect to Google Calendar for creating the meeting.
    this.$nextTick(function () {
      document.googleCalInput.submit()
    })
  },
  methods: {
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
      console.log(email)
      var bookedSpaces = JSON.parse(localStorage.getItem('bookedEmails'))
      if (bookedSpaces == null) {
        bookedSpaces = [email]
      } else {
        if (!bookedSpaces.includes(email)) {
          bookedSpaces.push(email)
        }
      }
      localStorage.setItem('bookedEmails', JSON.stringify(bookedSpaces))
    }
  }
}
</script>
