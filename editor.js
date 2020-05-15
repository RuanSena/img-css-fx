const pupp = require('puppeteer')
const fs = require('fs')
const path = require('path')

const local = 'localhost:8080'
let browser = null
let page = null
let img = null
let styleFX = {

}
const defaults = {
    filter: {blur: '', brightness: 1, contrast: 1, 'drop-shadow': '', grayscale: 0, 'hue-rotate': '', invert: 0, opacity: 1, saturate: 1, sepia: 0}
}
const editor = {
    open: async(img='', localhost=false) => {
        img = localhost ? `${local}/${img}` : img;
        browser = await pupp.launch({headless: false});
        [page] = await browser.pages();
        await page.goto(img, {timeout: 20000})
        await page.waitFor('img')
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
        await page.evaluate((fx) => {
            img = document.querySelector('img')
            for(let prop in fx) {
                img.style[prop] = fx[prop]
            }
        }, styleFX)
    },
    save: async(imgName='screenshot') => {
        fs.mkdirSync(path.join(__dirname, 'images'), {recursive: true})
        await page.screenshot({path: path.join(__dirname, 'images', `${imgName}_${Object.keys(styleFX).join('_')}.png`)})
        browser.close()
    }
}

module.exports = editor