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
    tags (tags) {
      for (var i = 0; i < tags.length; i++) {
        this.selectedItems.push(tags[i])
        var attributeItem = document.createElement('div')
        attributeItem.id = tags[i]
        var attributeText = document.createElement('p')
        var cancelButton = document.createElement('a')
        cancelButton.id = tags[i] + 'A'
        cancelButton.innerHTML = ' remove'
        cancelButton.addEventListener('click', this.handleRemoveClick)
        attributeItem.classList.add('attr')
        attributeText.innerHTML = tags[i]
        attributeItem.appendChild(attributeText)
        attributeText.appendChild(cancelButton)
        document.getElementById('selectedItemsArea').appendChild(attributeItem)
      }
    }
  },
  mounted () {
    document.getElementById('attributes').addEventListener('keyup', this.handleEnter)
    document.getElementById('addAttrButton').addEventListener('click', this.handleButtonClick)
  },
  methods: {
    handleEnter (event) {
      event.preventDefault()
      if (event.keyCode === 13) {
        this.addAttribute()
      }
    },
    handleButtonClick (event) {
      this.addAttribute()
    },
    handleRemoveClick (event) {
      var that = this
      var divId = event.target.id.slice(0, -1)
      document.getElementById(divId).remove()
      // remove from array
      for (var i = 0; i < that.selectedItems.length; i++) {
        if (that.selectedItems[i] === divId) {
          that.selectedItems.splice(i, 1)
        }
      }
    },
    addAttribute () {
      var that = this
      // remove invalid entry alert from screen
      var alert = document.getElementById('selectedItemsAlert')
      alert.innerHTML = ''
      alert.classList.remove('alert')
      alert.classList.remove('alert-info')
      //  no attribute was selected in the typeahead
      if (that.model === null) {
        //  do nothing
      } else if (that.model.name !== undefined) {
        if (that.selectedItems.includes(that.model.name)) {
          //  This attribute has been previously added to DOM.
          //  So, let's remove it from typeahead.
          this.model = null
        } else {
          //  Add the new attribute to DOM.
          that.selectedItems.push(that.model.name)
          var attributeItem = document.createElement('div')
          attributeItem.id = that.model.name
          var attributeText = document.createElement('p')
          var cancelButton = document.createElement('a')
          cancelButton.id = that.model.name + 'A'
          cancelButton.innerHTML = ' remove'
          cancelButton.addEventListener('click', this.handleRemoveClick)
          attributeItem.classList.add('attr')
          attributeText.innerHTML = that.model.name
          attributeItem.appendChild(attributeText)
          attributeText.appendChild(cancelButton)
          document.getElementById('selectedItemsArea').appendChild(attributeItem)
          //  Selected attribute has been added to the DOM.
          //  Let's now remove it from typeahead.
          this.model = null
        }
      } else {
        // the attribute is not in the list
        var info = document.createElement('p')
        info.innerHTML = 'There are no spaces with the attribute \'' + that.model + '.\' Please choose one from the list.'
        alert.appendChild(info)
        alert.classList.add('alert')
        alert.classList.add('alert-info')
      }
    }
  }
}
</script>
