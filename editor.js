const pupp = require('puppeteer')
const fs = require('fs')
const path = require('path')
const localServer = require('./local')

const LOCAL = 'localhost:8080'
let browser = null
let page = null
let imgHandle = null
let ops = []
let styleFX = {

}
const defaults = {
    filter: {blur: '', brightness: 1, contrast: 1, 'drop-shadow': '', grayscale: 0, 'hue-rotate': '', invert: 0, opacity: 1, saturate: 1, sepia: 0}
}
const editor = {
    open: async(imgPath='', localhost=false) => {
        imgPath = localhost ? `${LOCAL}/${imgPath}` : imgPath;
        browser = browser || await pupp.launch({headless: false});
        [page] = await browser.pages();
        await page.goto(imgPath, {timeout: 20000})
        await page.waitFor('img')
        imgHandle = await page.$('img')
    },
    filter: (options = {blur: '', brightness: 1, contrast: 1, drop_shadow: '', grayscale: 0, hue_rotate: '', invert: 0, opacity: 1, saturate: 1, sepia: 0}) => {
        let functions = []
        for(let [prop, val] of Object.entries(options)) {
            prop = prop.replace('_', '-')
            if(val !== defaults.filter[prop]) {
                functions.push(`${prop}(${val})`)
            }
        }
        if(functions.length) {
            styleFX.filter = `${functions.join(' ')}`
            ops.push('filter')
        }
    },
    resize: async(w=0, h=0, scale=1, ratio='initial') => {
        let {width, height} = await imgHandle.boundingBox()
        let newWidth = w || width
        let newHeight = h || height

        if(scale !== 1 && scale) styleFX.transform = styleFX.transform ? styleFX.transform + ` scale(${scale})` : `scale(${scale})`

        if(ratio !== 'initial') {
            styleFX.objectFit = 'cover';
            // cut aspect ratio
            switch (ratio) {
                case '1:1':
                    if(newWidth > newHeight) newWidth = newHeight
                    else newHeight = newWidth
                    break
                default:
                    // ratio width must be greater than height (3:2, 4:3, 16:9)
                    ratio = ratio.split(':')
                    newHeight = ((newWidth * Number(ratio[1])) / Number(ratio[0])).toFixed(2)
                    break
            }
        }
        
        if(newWidth !== width) styleFX.width = newWidth + 'px'
        if(newHeight !== height) styleFX.height = newHeight + 'px'
        ops.push('resize')
    },
    apply: async() => {
        console.log(styleFX)
        await imgHandle.evaluate((img, fx) => {
            img = document.querySelector('img')
            for(let prop in fx) {
                img.style[prop] = fx[prop]
            }
        }, styleFX)
    },
    save: async(imgName='screenshot') => {
        fs.mkdirSync(path.join(__dirname, 'images'), {recursive: true})
        imgName = `${imgName}_${ops.join('_')}.png`
        await imgHandle.screenshot({path: path.join(__dirname, 'images', imgName), type: 'png', omitBackground: true})
        console.log('+ ' + imgName)
    },
    close: async() => {
        // waits for 1s bef closing
        await page.waitFor(1000)
        await browser.close()
        localServer.server.close()

    }
}

module.exports = editor