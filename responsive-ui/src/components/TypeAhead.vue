<template>
  <section>
    <label for="attributes">Attributes</label>
    <p>Ex: food, WiFi, projector, etc.</p>
    <input id="attributes" class="form-control" type="text" placeholder="Type to search..." autocomplete="off">
    <!-- typeahead component is defined at: https://uiv.wxsm.space/typeahead/ -->
    <typeahead v-model="model" target="#attributes" :data="attributes" item-key="name" :open-on-empty="true"/>
    <button id="addAttrButton" class="btn btn-primary">Add attribute</button>

    <br>
    <div id="selectedItemsAlert">
    </div>
    <p><strong>Attributes for the space:</strong></p>

    <!-- Beginning of attribute list -->
    <div>
      <div v-bind:id="item" v-bind:key="item" v-for="item in selectedItems" class="" style="margin-right: 2px">
        <span class="attr">{{item}}</span>
        <button class="delete is-small" @click="removeAttribute(item)">x</button>
      </div>
    </div>
    <!-- End of attribute list -->

    <div v-if="selectedItems.length == 0">
      <p>No attributes added yet.</p>
    </div>
    <div id="selectedItemsArea">
    </div>
  </section>
</template>

<script>
// import attributes from '../../assets/data/attributes.json'
// import from server here
export default {
  props: ['tags'],
  data () {
    return {
      model: '',
      attributes: [{name: 'whiteboard'}, {name: 'chairs'}, {name: 'tables'}, {name: 'chalkboard'}, {name: 'food'}],
      selectedItems: []
    }
  },
  watch: {
    /**  This watch is invoked when the Edit Space page is loaded with bunch of attributes.
    */
    tags (tags) {
      for (var i = 0; i < tags.length; i++) {
        this.selectedItems.push(tags[i])
      }
    }
  },

  mounted () {
    document.getElementById('attributes').addEventListener('keyup', this.handleEnter)
    document.getElementById('addAttrButton').addEventListener('click', this.handleButtonClick)
  },

  methods: {
    /**  This method removes attribute with given span id from the list of selected attributes.
    */
    removeAttribute (attrSpanId) {
      document.getElementById(attrSpanId).remove()
      // remove from selectedItems array
      for (var i = 0; i < this.selectedItems.length; i++) {
        //  Note: The id of the attribute span id is also the attribute value.
        if (this.selectedItems[i] === attrSpanId) {
          this.selectedItems.splice(i, 1)
        }
      }
    },

    handleEnter (event) {
      event.preventDefault()
      if (event.keyCode === 13) {
        this.addAttribute()
      }
    },
    handleButtonClick (event) {
      this.addAttribute()
    },

    /** This method adds a valid attribute to the array of selectedItems,
    * shows an alert message for invalid attribute.
    * It also clears the typeahead input box.
    */
    addAttribute () {
      var that = this
      // remove invalid entry alert from screen
      var alert = document.getElementById('selectedItemsAlert')
      alert.innerHTML = ''
      alert.classList.remove('alert')
      alert.classList.remove('alert-info')

      //  If no attribute was selected in the typeahead
      if (that.model === null) {
        //  then do nothing.
      } else if (that.model.name !== undefined) {
        if (that.selectedItems.includes(that.model.name)) {
          //  This attribute has been previously added to array.
        } else {
          //  Add the new attribute to array.
          that.selectedItems.push(that.model.name)
        }
      } else {
        // the attribute is not in the list
        var info = document.createElement('p')
        info.innerHTML = 'There are no spaces with the attribute \'' + that.model + '.\' Please choose one from the list.'
        alert.appendChild(info)
        alert.classList.add('alert')
        alert.classList.add('alert-info')
      }
      //  Clear the typeahead input box.
      this.model = null
    }
  }
}
</script>
