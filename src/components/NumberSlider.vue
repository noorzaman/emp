<!-- https://www.npmjs.com/package/vue-slider-component -->

<template>
  <div class="numberSlider">
    <vue-slider ref="slider" v-model="capacity" id="capacity-slider" :min="minValue" :max="maxValue"
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
    capacity_prop: {
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
      capacity: (this.allowAny ? 0 : 1),
      minValue: (this.allowAny ? 0 : 1),
      maxValue: 50
    }
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('')
    }
  },
  watch: {
    capacity_prop (capacity) {
      this.capacity = capacity
    },
    /** The following code triggers when user selects/ changes
    * time in the time-picker. This code then notifies the parent
    * component of the change via 'change' event.
    */
    capacity (capacity) {
      this.$emit('change', capacity)
    }
  },
  methods: {
    /** This method returns the slider tooltip for the given
    * slider value. It is invoked by vue-slider-component when
    * slider value changes.
    */
    getSliderTooltip (capacity) {
      if (capacity === 0) {
        //  If the new slider value is zero, then set the toolttip to 'Any'
        return 'Any'
      } else if (capacity >= 50) {
        //  If the new slider value is equal to 50, then set the tooltip to 50+
        return '50+'
      }
      return capacity
    }
  }
}
</script>

<style scoped>
</style>
