<template>
  <section>
    <label for="attributes">Attributes</label>
    <p>Ex: food, WiFi, projector, etc.</p>
    <input id="attributes" class="form-control" type="text" placeholder="Type to search..." autocomplete="off" @keyup.enter="addAttribute">
    <!-- typeahead component is defined at: https://uiv.wxsm.space/typeahead/ -->
    <typeahead v-model="newAttribute" target="#attributes" :data="attributes" item-key="name" :open-on-empty="true"/>
    <button id="addAttrButton" class="btn btn-primary" @click="addAttribute">Add attribute</button>

    <br>
    <div id="selectedItemsAlert">
    </div>
    <p><strong>Attributes for the space:</strong></p>
    <div v-if="selectedAttributes.length == 0">
      <p>No attributes added yet.</p>
    </div>
    <div id="selectedItemsArea">
        <!-- Beginning of attribute list -->
        <div v-bind:id="item" v-bind:key="item" v-for="item in selectedAttributes" class="tag is-info" style="margin-right: 2px">
            <span class="attr">{{item}}</span>
            <button class="delete is-small" @click="removeAttribute(item)"><strong>x</strong></button>
        </div>
        <!-- End of attribute list -->
    </div>
  </section>
</template>

<script>
// import attributes from '../../assets/data/attributes.json'
// import from server here
export default {
  props: {
    //  initialize selectedAttributes as empty array
    selectedAttributes: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  data () {
    return {
      newAttribute: '',
      attributes: [{name: 'whiteboard'}, {name: 'chairs'}, {name: 'tables'}, {name: 'chalkboard'}, {name: 'food'}]
    }
  },

  methods: {
    /**  This method removes attribute with given span id from the list of selected attributes.
    */
    removeAttribute (attributeName) {
      // remove from selectedAttributes array
      for (var i = 0; i < this.selectedAttributes.length; i++) {
        //  Note: The id of the attribute span id is also the attribute value.
        if (this.selectedAttributes[i] === attributeName) {
          this.selectedAttributes.splice(i, 1)
        }
      }
    },

    /** This method adds a valid attribute to the array of selectedAttributes,
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
      if (that.newAttribute === null) {
        //  then do nothing.
      } else if (that.newAttribute.name !== undefined) {
        if (that.selectedAttributes.includes(that.newAttribute.name)) {
          //  This attribute has been previously added to array.
        } else {
          //  Add the new attribute to array.
          that.selectedAttributes.push(that.newAttribute.name)
        }
      } else {
        // the attribute is not in the list
        var info = document.createElement('p')
        info.innerHTML = 'There are no spaces with the attribute \'' + that.newAttribute + '.\' Please choose one from the list.'
        alert.appendChild(info)
        alert.classList.add('alert')
        alert.classList.add('alert-info')
      }
      //  Clear the typeahead input box.
      this.newAttribute = null
    }
  }
}
</script>
