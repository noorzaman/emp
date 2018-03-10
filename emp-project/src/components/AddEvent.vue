<template>
  <div class='main'>
    <h1>Create Calendar Event</h1>
    <form method='GET' action='https://calendar.google.com/calendar/r/eventedit'>

      <div class='form-group'>
        <label>title</label>
        <input type='text' name='text' value='Meeting title'/>
      </div>
      <div class='form-group'>
        <label>location</label>
        <input type='text' name='location' value='Location name'/>
      </div>
      <div class='form-group'>
        <label>location e-mail</label>
        <input type='text' name='add' value='location@emp.com'/>
      </div>
      <div class='form-group'>
        <label>details</label>
        <input type='text' name='details' value='Description for the meeting'/>
      </div>
      <div class='form-group'>
        <label>year</label>
        <input v-model='year' type='text'/>
        <label>month</label>
        <input v-model='month' type='text'>
        <label>day</label>
        <input v-model='day' type='text'/>
      </div>
      <div class='form-group'>
        <label>hour from</label>
        <input v-model='hourfrom' type='text'/>
        <label>minute from</label>
        <input v-model='minutefrom' type='text'/>
      </div>
      <div class='form-group'>
        <label>hour to</label>
        <input v-model='hourto' type='text'/>
        <label>minute to</label>
        <input v-model='minuteto' type='text'/>
      </div>
      <input :value='time' type='hidden' name='dates'/>
      <input type='hidden' name='trp' value='true'/>
      <input type='submit' value='Open Calendar'/>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      year: '2018',
      month: '5',
      day: '5',
      hourfrom: '5',
      hourto: '5',
      minutefrom: '5',
      minuteto: '10'
    }
  },
  computed: {
    time: function () {
      // add padding
      var pad = '00'
      var month = pad.substring(0, pad.length - this.month.length) + this.month
      var day = pad.substring(0, pad.length - this.day.length) + this.day
      var hourfrom = pad.substring(0, pad.length - this.hourfrom.length) + this.hourfrom
      var hourto = pad.substring(0, pad.length - this.hourto.length) + this.hourto
      var minutefrom = pad.substring(0, pad.length - this.minutefrom.length) + this.minutefrom
      var minuteto = pad.substring(0, pad.length - this.minuteto.length) + this.minuteto

      return this.year + month + day + 'T' + hourfrom + minutefrom + '00/' +
        this.year + month + day + 'T' + hourto + minuteto + '00'
    }
  }
}
</script>
