<template>
  <div class="numberSlider">
    <vue-slider ref="slider" v-model="value"></vue-slider>
  </div>
</template>
<script>
// Used only in vue2.x version
import vueSlider from 'vue-slider-component'
// or
// import vueSlider from 'vue-slider-component/src/vue2-slider.vue'

export default {
  name: 'NumberSlider',
  components: {
    vueSlider
  },
  data () {
    return {
      value: 'Any',
      options: {
        eventType: 'auto',
        width: 'auto',
        height: 6,
        dotSize: 10,
        dotHeight: null,
        dotWidth: null,
        min: 1,
        max: 100,
        interval: 1,
        show: true,
        speed: 0.5,
        disabled: false,
        piecewise: false,
        piecewiseStyle: false,
        piecewiseLabel: false,
        tooltip: false,
        tooltipDir: 'top',
        reverse: false,
        data: null,
        clickable: true,
        realTime: false,
        lazy: false,
        formatter: null,
        bgStyle: null,
        sliderStyle: null,
        processStyle: null,
        piecewiseActiveStyle: null,
        tooltipStyle: null,
        labelStyle: null,
        labelActiveStyle: null
      }
    }
  }
}
</script>

<style scoped>
    .numberSlider {
    }
</style>
