const editor = require('./editor')
const fs = require('fs')
const path = require('path')
const async = require('async')
const imgFormats = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp']

const localImages = fs.readdirSync(path.join(__dirname, 'images', 'champs')).filter(img => imgFormats.includes(img.slice(img.lastIndexOf('.')+1)) )

async.mapSeries(localImages, async (img) => {
    await editor.open(path.join('champs', img), true)
    await editor.resize(64)
    await editor.apply()
    img = img.slice(0, img.lastIndexOf('.'))
    return await editor.save(path.join('champs', img))
}, (err, images) => {
    if (err) { throw err }
    images.forEach(i => console.log('+ ' + i))
    editor.close()
})
// editor.open("https://i1.sndcdn.com/artworks-000644480044-6z10uu-t500x500.jpg")
//     .then(async () => {
//         // define styles effects
//         // editor.filter({blur: '2px', sepia: 0.6})
//         await editor.resize(64)
//         // apply styles
//         editor.apply()
//         // screenshots the image
//         editor.save()
//     })
//     .catch(console.error)
//     .finally(editor.close)