<template>
  <section>
    <label for="attributes">Attributes</label>
    <p>Ex: Food, WiFi, Projector, etc.</p>
    <div style="display: flex;">
      <div style="flex-basis: 250px">
        <input id="attributes" class="form-control" style="width: 250px" type="text" placeholder="Type to search..." autocomplete="off" @keyup.enter="addAttribute">
        <!-- https://uiv.wxsm.space/typeahead/ -->
        <typeahead v-model="newAttribute" target="#attributes" :data="uniqueAttributesList" :open-on-empty="false"/>
        <p class="text-danger">{{newAttributeError}}</p>
      </div>
      <div>
        <button class="btn btn-primary addAttrButton" @click="addAttribute">Add</button>
      </div>
    </div>
    <div>
      <div v-for="item in selectedAttributes" :key="item" class="tag is-info" style="margin-right: 2px">
        <span>{{item}}</span>
        <button class="delete is-small" @click="removeAttribute(item)"><strong>x</strong></button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    //  initialize selectedAttributes as empty array
    selectedAttributes: {
      type: Array,
      default () {
        return []
      }
    },
    // default allowing custom attributes to false
    allowCustom: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      newAttribute: '',
      newAttributeError: '',
      uniqueAttributesList: []
    }
  },
  mounted () {
    this.getUniqueAttributes()
  },
  methods: {
    /**  Removes attribute with given name from the list of selected attributes.
    */
    removeAttribute (attributeName) {
      // remove from selectedAttributes array
      for (var i = 0; i < this.selectedAttributes.length; i++) {
        if (this.selectedAttributes[i] === attributeName) {
          this.selectedAttributes.splice(i, 1)
          return
        }
      }
    },
    /** Adds a valid attribute to the array of selectedAttributes and
    * shows an alert message for invalid attribute.
    * It also clears the typeahead input box.
    */
    addAttribute () {
      // remove invalid entry alert from screen
      this.newAttributeError = ''

      // If no attribute was selected in the typeahead then do nothing.
      if (!this.newAttribute) { return }

      var attrListIndex = this.arrayIndexOf(this.uniqueAttributesList, this.newAttribute)
      if (!this.allowCustom && attrListIndex === -1) {
        // If we don't allow custom attributes and the attribute is not in the dropdown list, report error
        this.newAttributeError = 'There are no spaces with attribute \'' + this.newAttribute + '\''
      } else if (this.arrayIndexOf(this.selectedAttributes, this.newAttribute) === -1) {
        // If the attribute has not previously been selected, add it the way it is in the database if it's in the database
        if (attrListIndex === -1) {
          this.selectedAttributes.push(this.newAttribute)
        } else {
          this.selectedAttributes.push(this.uniqueAttributesList[attrListIndex])
        }
      }
      // Clear the typeahead input box.
      this.newAttribute = ''
    },
    /** Case insensitive version of Array.indexOf()
    */
    arrayIndexOf (array, str) {
      var query = str.toLowerCase()
      var index = -1
      array.some(function (element, i) {
        if (query === element.toLowerCase()) {
          index = i
          return true
        }
      })
      return index
    },
    /** Populate uniqueAttributesList with all unique attributes in the database
    */
    getUniqueAttributes () {
      let data = {
        'size': 0,
        'aggs': {
          'attributes': {
            'terms': {
              'field': 'space.attributes.keyword',
              'size': 10000
            }
          }
        }
      }
      let jsonData = JSON.stringify(data)
      var searchUrl = this.$commonTagsUrl + '/_search'
      this.$http.post(searchUrl, jsonData, {
        headers: this.$defaultHeaders
      }).then(result => {
        var arr = []
        var searchResult = result.body.aggregations.attributes.buckets
        // concatenating all attributes together
        for (var i = 0; i < searchResult.length; i++) {
          arr = arr.concat(searchResult[i].key)
        }
        // dropping duplicates and sorting
        var uniqueArray = arr.filter(function (item, pos) {
          return arr.indexOf(item) === pos
        })
        this.uniqueAttributesList = uniqueArray.sort()
      }, error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
