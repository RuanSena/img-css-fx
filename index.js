const localServer = require('./local')
const editor = require('./editor')

editor.open('imageScreenshot.png', true)
    .then(() => {
        // define styles effects
        editor.filter({blur: '2px', sepia: 0.6})
    })
    .catch(console.error)
    .finally(() => {
        // apply styles
        editor.apply()
        // screenshots the image
        editor.save('filter')
    })