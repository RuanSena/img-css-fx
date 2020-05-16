const pupp = require('puppeteer')
const fs = require('fs')
const path = require('path')
const localServer = require('./local')

const LOCAL = 'localhost:8080'
let browser = null
let page = null
let imgHandle = null
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
        } else {
            styleFX.filter = 'none'
        }
    },
    apply: async() => {
        await imgHandle.evaluate((img, fx) => {
            img = document.querySelector('img')
            for(let prop in fx) {
                img.style[prop] = fx[prop]
            }
        }, styleFX)
    },
    save: async(imgName='screenshot') => {
        fs.mkdirSync(path.join(__dirname, 'images'), {recursive: true})
        imgName = `${imgName}_${Object.keys(styleFX).join('_')}.png`
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