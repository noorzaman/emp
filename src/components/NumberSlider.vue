<template>
  <div class="numberSlider">
    <vue-slider ref="slider" v-model="value" id="capacity-slider" :min="minValue" :max="maxValue"
    :formatter=getSliderTooltip />
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default {
  name: 'NumberSlider',
  components: {
    vueSlider
  },
  props: {
    capacity: {
      capacity: Number,
      default () {
        return this.minValue
      }
    },
    allowAny: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      value: (this.allowAny ? 0 : 1),
      minValue: (this.allowAny ? 0 : 1),
      maxValue: 50
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
    getSliderTooltip (value) {
      if (value === 0) {
        //  If the new slider value is zero, then set the toolttip to 'Any'
        return 'Any'
      } else if (value >= 50) {
        //  If the new slider value is equal to 50, then set the tooltip to 50+
        return '50+'
      }
      return value
    }
  }
}
</script>

<style scoped>
</style>
