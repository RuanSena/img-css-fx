const static = require('node-static')
const http = require('http')
const path = require('path')
const PORT = 8080
const FOLDER = 'images'
let file = new(static.Server)(path.join(__dirname, FOLDER))

http.createServer(function (req, res) {
    // transmit request to static for serving images
    file.serve(req, res).addListener('error', (err) => {
        console.error(`Error file ${req.url} - ${err.message}`)
    })
}).listen(PORT, () => {
    console.log(`http serving files from ${FOLDER} on port: ${PORT}`)
});