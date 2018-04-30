'use strict'

module.exports = {
  url: function() {
    return this.api.globals.devServerURL
  },
  elements: {
  },
  commands: [{
    goToAddSpacePage: function () {
      this.waitForElementVisible('#app', 5000)
      //  Navigate to Add Space page
      this.click('#desktop-add-space-link')
      //  Wait for 5 second for page to render
      this.api.pause(5000)
      this.api.execute(function removeStyle(selector) {
      //  Unhide test-image-data text box so that selenium can enter imageData in it.
        document.querySelector('#test-image-data').removeAttribute('style')
      //  Unhide test-set-image-btn so that selenium can click on it.
        document.querySelector('#test-set-image-btn').removeAttribute('style')
      }, [])
      return this.api.page.AddSpacePage()
    }
  }]
}