'use strict'

module.exports = {
  url: function() {
    //unsupported
  },
  elements: {
    spaceName: '#name',
    spaceId: '#spaceId',
    casual: '#casual',
    studious: '#studious',
    fancy: '#fancy',
    professional: '#professional',
    cozy: '#cozy'
  },
  commands: [{
    save: function () {
      this.click('#save-btn') //  click save button to save the space
      this.api.pause(5000)
      return this.api.page.ViewSpacePage()
    }
  }]
}