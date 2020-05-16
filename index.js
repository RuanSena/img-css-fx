const editor = require('./editor')

editor.open("https://i1.sndcdn.com/artworks-000644480044-6z10uu-t500x500.jpg")
    .then(() => {
        // define styles effects
        editor.filter({blur: '2px', sepia: 0.6})

        // apply styles
        editor.apply()
        // screenshots the image
        editor.save('filter')
    })
    .catch(console.error)
    .finally(editor.close)