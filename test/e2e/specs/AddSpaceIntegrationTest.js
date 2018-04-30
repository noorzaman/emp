/** This is an end to end (E2E) test. It tests that a new space can be created in 
  * the 'Meet Anywhere' web application. This test uses Page Object design pattern
  * to separate the assertion logic from UI component discovery logic.
  * The page objects are defined in test/e2e/pages directory and configured in
  * nightwatch.conf.js. This test uses the page objects to simulate the user journey
  * and asserts that application is showing correct results.
  * 'Add Space' user journey includes providing a space name, space image and
  *  themes. This E2E test performs all of these steps.
  */
module.exports = {

  'add space': function (browser) {

    //Open Meet Anywhere home page and click on Add Space link.
    var addSpacePage = browser.page.BrowseAllPage()
    .navigate().goToAddSpacePage()

    //  Validate that Add Space page has rendered the header message
    addSpacePage.assert.containsText('h1', 'Add a New Space')

    // This is the name of the new space created by this test.
    var spaceName = 'nightwatch e2e'
    //  This is the base 64 encoded sample image for this new space.
    var imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABpCAYAAAA5gg06AAAD+0lEQVR4Xu3dv27UQBAG8LOIEBFPkJZXoEWiikSBdLwBRd4AiZKKjgjegII3oKBAokJKm1egTYdEwZ8C6ZAjHPkc2zuz3p35xvelte88nt/O7N5e7q759Xa72/APOgMNkaB9roMjEr4RkQIYEYlIETIQIEbOSUQKkIEAIbKSiBQgAwFChKik4xcfYVP1+90z99hckZBxhjKeWEQS1slBIkWqos7RC8qtkogkLGGvDdaIQJ7V5FJJRJJXkdtbFUQCR4oM5NXyzNsdkXRV5NLuiASOtAYgj5Zn2u6IpK8i83ZHJHCkNQFZt7zq7e7q59+zB68+vc8bQ/iP+vb66dnJ/aOq9zeLtMbRj8o+t3k7ikQcP8oxrD0k4vjhzL3JeINEIByg4cKESHg2NxF1re8aiVWEK9VCNbvdLuznkzRvZ0ceiOGQNDBT9RENLARSCZjIYNBINXGGaMjVBYtkCdSBoULBIVnshc2t5S6v/pw+Ov/8peR678f59uvdO83j9jlzBgIUkkf11J6rxu5JCwWDhARUsv1N3ZcGCgIJEagU1CqQkIFKQB08kqZlLBkMmuvM7Wbnoru2u9zElU6aZCW35Jrt83f3mvM8bkg5QDk3OAXgfX3JwOjOCYNUEij3H0lqxCDBckHSjuKayUGKZQoMHqkmUE5FWcQzxDJH0oxcy4SgxtWCEen/sCVSr36lybCsIm3bs47NtJKkQLm7xZKV0tw5qPFBIlmP1D6cFMoyRiINSotIwu/psRylkr22sRZpGSNcJdV4Z1QzV31/s/1wfNQ8Tz3moJEsb37Jvp5lnHCVZHnzRBrJgGRSJtLtxLGSAgwmOCSvF7LIuw5E4uuk/QxI5iRWUoA5iUjOSO3lkasJNTbTOYlIqX2M8eOwSNZtT1pF1nG5vDOrqSarhCADEWmz2Vy8fHL68OSe+KMuHjsi5u1O+6KxPb/W9xNpPwvlAeRWSdqW18GWTJKmxdW4vmYJ4VZJnlCRgFwrKRdpyajOwVlyPU21zJ3rWklLoSQJXAIjef5SENBIpaBqJavkPJgbo3sl5az2cm9W+zgEIPc5aZi0Eq1JCzF1PgoQHBJK60MCgkTyhkIDgkXymKcQcbo8wCwcpuYGi3kKGQi+kvpwNbDQccJU0liFLQGLAtO/b/h2p1lS9/EiYkzd66qQNKCRziVSAC0iESlABgKEyC9vB0dqF0NEioLUxrmmJSt43sXhdS8p+NM84pTZnth/zXfrR65YUbYYkh0V/hKZv8leBGNbXskfXmRl1VdM7UUmkeqHyCukMkCkVIYAjhMJACEVApFSGQI4TiQAhFQIREplCOA4kQAQUiEQKZUhgONEAkBIhUCkVIYAjv8D6STnqYkXE/oAAAAASUVORK5CYII='
    addSpacePage.setValue('@spaceName', spaceName) // set space name
    addSpacePage.setImageData(imageData)  //  select image
    
    var editSpacePage = addSpacePage.uploadImage()  //  upload image
    var spaceId = 'crap'
    editSpacePage.getText('@spaceId', function (result) {
      spaceId = result.value
    })
    
    // verify that space id is present
    editSpacePage.expect.element('@spaceId').to.be.present
    editSpacePage.expect.element('@spaceId').text.to.contain('group.calendar.google.com');

    var viewSpacePage = editSpacePage
    .click('@casual') //  select casual theme
    .click('@studious') //  select studious theme
    .click('@fancy')  //  select fancy theme
    .click('@professional') //  select professional theme
    .save() //click save button

    //  ensure that selected themes are present
    viewSpacePage.expect.element('@casual').to.be.present
    viewSpacePage.expect.element('@studious').to.be.present
    viewSpacePage.expect.element('@fancy').to.be.present
    viewSpacePage.expect.element('@professional').to.be.present
    viewSpacePage.expect.element('@cozy').to.not.be.present
    viewSpacePage.assert.containsText('h1', spaceName)

    //  delete the space created by this test.
    //  We can only get hold of spaceId string value in
    //  browser.perform() method. Refer to following link for more details:
    //  https://github.com/nightwatchjs/nightwatch/issues/1244
    browser.perform(function() {
      //Open Meet Anywhere home page and click on Add Space link.
      const devServer = browser.globals.devServerURL
      var deleteSpaceUrl = devServer + '/delete-space/' + spaceId
      browser
        .url(deleteSpaceUrl)
        .waitForElementVisible('#app', 5000)
        .pause(5000)
        //  confirm that the space is deleted
        .assert.containsText('#message', 'deleted')
    })

    browser.end() //  close the browser
  }
}
