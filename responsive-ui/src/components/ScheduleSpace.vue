<template>
  <div class='main'>
    <!-- <h1><center>Redirecting to Google Calendar...</center></h1> -->
    <form name='googleCalInput' method='GET' action='https://calendar.google.com/calendar/r/eventedit'>
      <div class='form-group'>
        <!-- <input hidden type='text' name='add' value='noor@ebay.com'/> -->
        <!-- <input hidden type='text' name='add' :value="getSpaceEmail" /> -->
        <input hidden type='text' name='add' :value="spaceEmail" />
        <input type='hidden' name='trp' value='true'/>
        <input :value='time' type='hidden' name='dates'/>
      </div>
      <input hidden type='submit' value='Open Calendar'/>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      spaceEmail: this.$route.params.spaceId,
      startDate: this.$route.params.startDate,
      startTime: this.$route.params.startTime,
      endTime: this.$route.params.endTime
    }
  },
  computed: {

    time: function () {
      var ds = new Date()

      if (this.startDate && this.startDate !== 'u') {
        ds = new Date(this.startDate)
      }

      if (this.startTime && this.startTime !== 'u') {
        var startHours = this.startTime.split(':')[0]
        var startMinutes = this.startTime.split(':')[1]
        ds.setHours(startHours)
        ds.setMinutes(startMinutes)
      } else {
        // date time start to the nearest half hour
        ds.setMinutes(ds.getMinutes() + 59)
        ds.setMinutes(0)
      }
      var startDateStr = this.dateToString(ds)

      // date time end
      var de = ds

      if (this.endTime && this.endTime !== 'u') {
        var endHours = this.endTime.split(':')[0]
        var endMinutes = this.endTime.split(':')[1]
        de.setHours(endHours)
        de.setMinutes(endMinutes)
      } else {
        de.setMinutes(de.getMinutes() + 30)
      }

      var endDateStr = this.dateToString(de)

      var dateTimeStr = startDateStr + '/' + endDateStr

      // return '20180320T204000/20180320T204000'
      console.log(dateTimeStr)
      return dateTimeStr
    }
  },
  mounted: function () {
    //  Let's add this space to list of booked spaces.
    this.updateListOfBookedSpaces(this.spaceEmail)
    //  And redirect to Google Calendar for creating the meeting.
    this.$nextTick(function () {
      document.googleCalInput.submit()
    })
  },
  methods: {

    dateToString (date) {
      var year = date.getFullYear()
      var month = String(date.getMonth() + 1)
      month = month.length < 2 ? '0' + month : month
      var day = String(date.getDate())
      day = day.length < 2 ? '0' + day : day
      var hour = String(date.getHours())
      hour = hour.length < 2 ? '0' + hour : hour
      var minutes = String(date.getMinutes())
      minutes = minutes.length < 2 ? '0' + minutes : minutes
      return year + '' + month + '' + day + 'T' + hour + minutes + '00'
    },

    /** This method adds given space email address
    * to list of booked spaces. This list of booked
    * spaces is persisted on local storage.
    */
    updateListOfBookedSpaces (spaceEmail) {
      var bookedSpaces = JSON.parse(localStorage.getItem('bookedEmails'))
      if (bookedSpaces == null) {
        bookedSpaces = [spaceEmail]
      } else {
        if (!bookedSpaces.includes(spaceEmail)) {
          bookedSpaces.push(spaceEmail)
        }
      }
      localStorage.setItem('bookedEmails', JSON.stringify(bookedSpaces))
    }
  }
}
</script>
