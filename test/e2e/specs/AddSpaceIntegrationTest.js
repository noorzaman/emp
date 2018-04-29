module.exports = {
  'add space': function (browser) {

    var addSpacePage = browser.page.BrowseAllPage()
    .navigate()
    .goToAddSpacePage()

    //  Validate that Add Space page has rendered the header message
    addSpacePage.assert.containsText('h1', 'Add a New Space')

    var spaceName = 'casual nightwatch'
    //  imageData variable contains a sample image which is base 64 encoded.
    //  This imageData is used for uploading a sample image.
    var imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABpCAYAAAA5gg06AAAD+0lEQVR4Xu3dv27UQBAG8LOIEBFPkJZXoEWiikSBdLwBRd4AiZKKjgjegII3oKBAokJKm1egTYdEwZ8C6ZAjHPkc2zuz3p35xvelte88nt/O7N5e7q759Xa72/APOgMNkaB9roMjEr4RkQIYEYlIETIQIEbOSUQKkIEAIbKSiBQgAwFChKik4xcfYVP1+90z99hckZBxhjKeWEQS1slBIkWqos7RC8qtkogkLGGvDdaIQJ7V5FJJRJJXkdtbFUQCR4oM5NXyzNsdkXRV5NLuiASOtAYgj5Zn2u6IpK8i83ZHJHCkNQFZt7zq7e7q59+zB68+vc8bQ/iP+vb66dnJ/aOq9zeLtMbRj8o+t3k7ikQcP8oxrD0k4vjhzL3JeINEIByg4cKESHg2NxF1re8aiVWEK9VCNbvdLuznkzRvZ0ceiOGQNDBT9RENLARSCZjIYNBINXGGaMjVBYtkCdSBoULBIVnshc2t5S6v/pw+Ov/8peR678f59uvdO83j9jlzBgIUkkf11J6rxu5JCwWDhARUsv1N3ZcGCgIJEagU1CqQkIFKQB08kqZlLBkMmuvM7Wbnoru2u9zElU6aZCW35Jrt83f3mvM8bkg5QDk3OAXgfX3JwOjOCYNUEij3H0lqxCDBckHSjuKayUGKZQoMHqkmUE5FWcQzxDJH0oxcy4SgxtWCEen/sCVSr36lybCsIm3bs47NtJKkQLm7xZKV0tw5qPFBIlmP1D6cFMoyRiINSotIwu/psRylkr22sRZpGSNcJdV4Z1QzV31/s/1wfNQ8Tz3moJEsb37Jvp5lnHCVZHnzRBrJgGRSJtLtxLGSAgwmOCSvF7LIuw5E4uuk/QxI5iRWUoA5iUjOSO3lkasJNTbTOYlIqX2M8eOwSNZtT1pF1nG5vDOrqSarhCADEWmz2Vy8fHL68OSe+KMuHjsi5u1O+6KxPb/W9xNpPwvlAeRWSdqW18GWTJKmxdW4vmYJ4VZJnlCRgFwrKRdpyajOwVlyPU21zJ3rWklLoSQJXAIjef5SENBIpaBqJavkPJgbo3sl5az2cm9W+zgEIPc5aZi0Eq1JCzF1PgoQHBJK60MCgkTyhkIDgkXymKcQcbo8wCwcpuYGi3kKGQi+kvpwNbDQccJU0liFLQGLAtO/b/h2p1lS9/EiYkzd66qQNKCRziVSAC0iESlABgKEyC9vB0dqF0NEioLUxrmmJSt43sXhdS8p+NM84pTZnth/zXfrR65YUbYYkh0V/hKZv8leBGNbXskfXmRl1VdM7UUmkeqHyCukMkCkVIYAjhMJACEVApFSGQI4TiQAhFQIREplCOA4kQAQUiEQKZUhgONEAkBIhUCkVIYAjv8D6STnqYkXE/oAAAAASUVORK5CYII='

    addSpacePage.setValue('@spaceName', spaceName) //  set space name
    addSpacePage.setImageData(imageData)
    var editSpacePage = addSpacePage.uploadImage()

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

    browser.end() //  close the browser
  }
}
