const static = require('node-static')
const http = require('http')
const path = require('path')
const PORT = 8080
const FOLDER = 'images'
let file = new(static.Server)(path.join(__dirname, FOLDER))

exports.server = http.createServer(function (req, res) {
    // transmit request to static for serving images
    file.serve(req, res, function (err, res) {
        if (err) { // An error as occured
            console.error("> Error serving " + req.url + " - " + err.message);
            res.writeHead(err.status, err.headers);
            res.end();
        }
    })
}).listen(PORT, () => {
    console.log(`http serving files from ${FOLDER} on port: ${PORT}`)
});