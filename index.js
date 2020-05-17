const editor = require('./editor')

editor.open("https://i1.sndcdn.com/artworks-000644480044-6z10uu-t500x500.jpg")
    .then(async () => {
        // define styles effects
        // editor.filter({blur: '2px', sepia: 0.6})
        await editor.resize(64)
        // apply styles
        editor.apply()
        // screenshots the image
        editor.save()
    })
    .catch(console.error)
    .finally(editor.close)