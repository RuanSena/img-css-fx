const pupp = require('puppeteer')
const fs = require('fs')
const path = require('path')

let browser = null
let page = null
let img = null

const editor = {
    open: async(imgPath='') => {
        browser = await pupp.launch({headless: false});
        [page] = await browser.pages();
        await page.goto(imgPath, {timeout: 10000})
        await page.waitFor('img')
        img = await page.$('img')
    },
    save: async() => {
        fs.mkdirSync(path.join(__dirname, 'images'), {recursive: true})
        await page.screenshot({path: path.join(__dirname, 'images', 'imageScreenshot.png')})
        browser.close()
    }
}

module.exports = editor