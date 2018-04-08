<template>
  <div class="numberSlider">
    <vue-slider ref="slider" v-model="value" id="capacity-slider" :min=0 :max=50
    :formatter=getSliderTooltip />
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
      value: '0'
    }
  },
  watch: {
    capacity (value) {
      this.value = value
    }
  },

  methods: {

    /** This method returns the slider tooltip for the given
    * slider value. It is invoked by vue-slider-component when
    * slider value changes.
    */
    getSliderTooltip (newSliderValue) {
      //  Workaround: There seems to be a bug in vue-slider-component
      //  where during page load it invokes this method with value '0'
      //  instead of 0. We workaround that bug in the if condition below.
      if (newSliderValue === '0' || newSliderValue === 0) {
        //  If the new slider value is zero,
        //  then set the toolttip to 'Any'
        return 'Any'
      } else if (newSliderValue >= 50) {
        //  If the new slider value is equal to 50,
        //  then set the tooltip to 50+
        return '50 +'
      }
      return newSliderValue
    }
  }
}
</script>

<style scoped>
    .numberSlider {
    }
</style>
