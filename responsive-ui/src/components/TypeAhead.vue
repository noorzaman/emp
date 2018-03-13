<template>
  <section>
    <label for="attrivutes">Attributes</label>
    <p>Ex: food, WiFi, projector, etc.</p>
    <input id="attributes" class="form-control" type="text" placeholder="Type to search...">
    <typeahead v-model="model" target="#attributes" :data="attributes" item-key="name"/>
    <br/>
    <alert v-show="model">You selected {{model}}</alert>
  </section>
</template>
<script>
// import attributes from '../../assets/data/attributes.json'

export default {
  data () {
    return {
      model: '',
      attributes: [{name: 'whiteboard'}, {name: 'chairs'}, {name: 'tables'}, {name: 'chalkboard'}, {name: 'food'}]
    }
  }
}
</script>
<!-- typeahead-example.vue -->
