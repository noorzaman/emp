<template>
  <section>
    <label for="attributes">Tags</label>
    <p>Ex: food, WiFi, projector, etc.</p>

    <div id="attributeContainer">
      <div>
        <input id="attributes" class="form-control" type="text" placeholder="Type to search..." autocomplete="off" @keyup.enter="addAttribute">
        <!-- typeahead component is defined at: https://uiv.wxsm.space/typeahead/ -->
        <typeahead v-model="newAttribute" target="#attributes" :data="attributes()" item-key="name" :open-on-empty="true"/>
        <p class="text-danger">{{newAttributeError}}</p>
      </div>
      <div>
        <button id="addAttrButton" class="btn btn-primary" @click="addAttribute">Add</button>
      </div>
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
      newAttributeError: ''
      // attributes: [ {name: 'chairs'}, {name: 'chalkboard'}, {name: 'food'}, {name: 'projector'}, {name: 'tables'}, {name: 'wifi'}, {name: 'whiteboard'} ]
    }
  },

  methods: {
    /**  This method removes attribute with given name from the list of selected attributes.
    */
    removeAttribute (attributeName) {
      // remove from selectedAttributes array
      for (var i = 0; i < this.selectedAttributes.length; i++) {
        if (this.selectedAttributes[i] === attributeName) {
          this.selectedAttributes.splice(i, 1)
        }
      }
    },

    /** This method returns true if given item exists in the given array,
    * otherwise returns false.
    * Caution: This method does not perform any null/ type checks on
    * given arguments.
    */
    isExist (array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
          return true
        }
      }
      return false
    },

    /** This method adds a valid attribute to the array of selectedAttributes,
    * shows an alert message for invalid attribute.
    * It also clears the typeahead input box.
    */
    addAttribute () {
      // remove invalid entry alert from screen
      this.newAttributeError = ''

      if (this.newAttribute === null) {
        //  If no attribute was selected in the typeahead
        //  then do nothing.
      } else if (this.newAttribute.name === undefined) {
        // the attribute is not in the list
        this.newAttributeError = 'There are no spaces tagged with \'' + this.newAttribute + '\'.'
      } else if (!this.isExist(this.selectedAttributes, this.newAttribute.name)) {
        // If newAttribute does has not been previously added to selectedAttributes,
        //  then add it to selectedAttributes array.
        this.selectedAttributes.push(this.newAttribute.name)
      }
      //  Clear the typeahead input box.
      this.newAttribute = null
    },
    attributes: function () {
      var arrUniq = []
      var search = {
        'query': {
          'term': {
            'space.themes': 'casual'
          }
        }
      }
      var jsonStr = JSON.stringify(search)
      var searchUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?pretty&_source=space.attributes'
      this.$http.get(searchUrl, jsonStr, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(result => {
        var arr = []
        for (var i = 0; i < result.body.hits.hits.length; i++) {
          var attribs = result.body.hits.hits[i]._source.space.attributes
          arr = arr.concat(attribs)
        }
        // sort
        arr = arr.sort()
        // drop duplicates
        var seen = {}
        for (var j = 0; j < arr.length; j++) {
          if (arr[j] in seen) {
            ;
          } else {
            seen[arr[j]] = 1
            var obj = {'name': arr[j]}
            arrUniq.push(obj)
          }
        }
      }, error => {
        console.log(error)
      })
      return arrUniq
    }
  }
}
</script>

<style scoped>
  #attributeContainer {
    display: flex;
  }
</style>
