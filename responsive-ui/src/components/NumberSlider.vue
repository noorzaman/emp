<template>
  <div class="numberSlider">
    <vue-slider ref="slider" v-model="value" id="capacity-slider" @callback="sliderMoved"></vue-slider>
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
  props: ['capacity'],
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
  },
  watch: {
    capacity (value) {
      this.value = value
    }
  },
  methods: {

    /** This method sets the slider value to 'Any' instead of zero.
    * This method is invoked by vue-slider-component when the slider moves.
    */
    sliderMoved (newSliderValue) {
      if (newSliderValue === 0) {
        //  If the new slider value is zero,
        //  then get the reference to vue-slider-component instance
        //  and set the value to 'Any'.
        //  Make sure to set the callback to false,
        //  so that setValue() doesn't trigger another invocation of sliderMoved().
        this.$refs.slider.setValue('Any', false)
      }
    }
  }
}
</script>

<style scoped>
    .numberSlider {
    }
</style>
