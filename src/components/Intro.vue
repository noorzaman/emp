<template>
  <div class="intro">
    <h1>Explore Meeting Spaces</h1>
    <div class="introText">
      <p>Explore traditional and nontraditional meeting spaces</p>
      <ul>
        <li>Search by theme, attribute, availability, or capacity</li>
        <li>View your previously booked rooms</li>
        <li>Add room tags with image recognition</li>
        <li>Book through Google Calendar</li>
      </ul>
    </div>
    <div class="sliderContainer">
      <slider></slider>
    </div>
    <div class="clearFix"></div>
    <hr>
  </div>
</template>

<script>
import Slider from './Slider'
export default {
  name: 'Intro',
  components: {
    'Slider': Slider
  }
}
</script>
