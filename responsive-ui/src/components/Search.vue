<template>
  <div class="main">
    <h1>Meeting Space Criteria</h1>
    <form method="GET" action="/" class="searchForm">
        <div class="form-group">
            <label>Capacity</label>
            <NumberSlider></NumberSlider>
        </div>
        <div class="form-group">
            <label>Meeting time</label>
            <DatePicker></DatePicker>
            <p>Time picker will go here</p>
        </div>
        <div class="form-group">
            <label>Theme</label>
            <input type="checkbox" name="vehicle" value="Bike"> Casual <br>
            <input type="checkbox" name="vehicle" value="Bike"> Celebratory <br>
            <input type="checkbox" name="vehicle" value="Bike"> Cozy <br>
            <input type="checkbox" name="vehicle" value="Bike"> Fancy <br>
            <input type="checkbox" name="vehicle" value="Bike"> Fun <br>
            <input type="checkbox" name="vehicle" value="Bike"> Professional <br>
            <input type="checkbox" name="vehicle" value="Bike"> Quiet <br>
            <input type="checkbox" name="vehicle" value="Bike"> Studious <br>
            <input type="checkbox" name="vehicle" value="Bike"> Zen <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another1 <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another2 <br>
            <input type="checkbox" name="vehicle" value="Bike"> Another3 <br>
        </div>
        <div class="form-group">
            <label>Attributes</label>
            <p>Ex: food, WiFi, projector, etc.</p>
            <input type="text" placeholder="attributes search bar will go here"/>
            <p>Attributes for the space:</p>
            <p>No attributes added yet.</p>
        </div>
        <input type="submit" value="Search Spaces"/>
    </form>
  </div>
</template>

<script>
import NumberSlider from './NumberSlider'
import DatePicker from './DatePicker'
export default {
  name: 'Search',
  components: {
    'NumberSlider': NumberSlider,
    'DatePicker': DatePicker
  }
}
</script>

<style scoped>
</style>
