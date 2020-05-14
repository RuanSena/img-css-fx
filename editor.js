const pupp = require('puppeteer')
const fs = require('fs')
const path = require('path')

let browser = null
let page = null
let img = null
let fx = {

}
const defaults = {
    filter: {blur: '', brightness: 1, contrast: 1, 'drop-shadow': '', grayscale: 0, 'hue-rotate': '', invert: 0, opacity: 1, saturate: 1, sepia: 0}
}
const editor = {
    open: async(imgPath='') => {
        browser = await pupp.launch({headless: false});
        [page] = await browser.pages();
        await page.goto(imgPath, {timeout: 10000})
        await page.waitFor('img')
    },
    filter: (options = defaults.filter) => {
        
    },
    apply: async() => {
        await page.evaluate(() => {
            img = document.querySelector('img')

        })
    },
    save: async(imgName='screenshot') => {
        fs.mkdirSync(path.join(__dirname, 'images'), {recursive: true})
        await page.screenshot({path: path.join(__dirname, 'images', `${imgName}.jpeg`)})
        browser.close()
    }
}

module.exports = editor