'use strict'

module.exports = {
  url: function() {
    return this.api.globals.devServerURL
  },
  elements: {
    spaceName: '#name'
  },
  commands: [{
    setImageData: function (imageData) {
      //  set image data in the text box
      this.setValue('#test-image-data', imageData)
      //  invoke setImage() function to simulate user manually selecting a file
      //  via file picker dialog
      return this.click('#test-set-image-btn')
    },

    uploadImage: function () {
      this.click('#upload-image-btn') //  upload image
      this.api.pause(5000)  //  Wait for 5 second for page to render
      this.waitForElementVisible('#save-btn', 5000) //  validate that image upload was successful
      return this.api.page.EditSpacePage()
    }
  }]
}