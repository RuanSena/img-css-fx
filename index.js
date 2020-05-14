const editor = require('./editor')

editor.open('https://www.colorzilla.com/images/colorzilla-for-chrome.png')
    .then(() => {
        editor.save()
    })
    .catch(console.error)