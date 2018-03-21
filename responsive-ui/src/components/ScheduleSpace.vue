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
      spaceEmail: this.$route.params.spaceEmail
    }
  },
  computed: {
    // getSpaceEmail: function(){
    //   return this.spaceEmail
    // },

    time: function () {
      // date time start to the nearest half hour
      var ds = new Date()
      ds.setMinutes(ds.getMinutes() + 59)
      ds.setMinutes(0)

      var syear = ds.getFullYear()
      var smonth = String(ds.getMonth() + 1)
      smonth = smonth.length < 2 ? '0' + smonth : smonth
      var sday = String(ds.getDate())
      sday = sday.length < 2 ? '0' + sday : sday
      var shour = String(ds.getHours())
      shour = shour.length < 2 ? '0' + shour : shour
      var smin = String(ds.getMinutes())
      smin = smin.length < 2 ? '0' + smin : smin

      // date time end
      var de = ds
      de.setMinutes(de.getMinutes() + 30)
      var eyear = de.getFullYear()
      var emonth = String(de.getMonth() + 1)
      emonth = emonth.length < 2 ? '0' + emonth : emonth
      var eday = String(de.getDate())
      eday = eday.length < 2 ? '0' + eday : eday
      var ehour = String(de.getHours())
      ehour = ehour.length < 2 ? '0' + ehour : ehour
      var emin = String(de.getMinutes())
      emin = emin.length < 2 ? '0' + emin : emin

      var dateTimeStr = syear + '' + smonth + '' + sday + 'T' + shour + smin + '00/' +
                        eyear + '' + emonth + '' + eday + 'T' + ehour + emin + '00'

      // return '20180320T204000/20180320T204000'
      return dateTimeStr
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // redirect to Google calendar
      document.googleCalInput.submit()
    })
  }
}
</script>
