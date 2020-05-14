const editor = require('./editor')

editor.open('https://www.colorzilla.com/images/colorzilla-for-chrome.png')
    .then(() => {
        // define styles effects
        editor.filter({blur: '4px', sepia: 0.4})
    })
    .catch(console.error)
    .finally(() => {
        // apply styles
        editor.apply()
        // screenshots the page
        editor.save('filter')
    })