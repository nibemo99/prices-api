const axios = require('axios')
const cheerio = require('cheerio')
const { log } = require('console')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const { type, arch } = require('os')
const app = express()

// Middleware cors
app.use(cors())



// EXITO
app.get('/exito/:id', (request, response) => {
    const search = request.params.id
    const { page } = request.query
    const URL = (page)
        ? `https://www.exito.com/${search}?_q=${search}&map=ft&page=${page}`
        : `https://www.exito.com/${search}?_q=${search}&map=ft`
    axios.get(URL)
        .then((res) => {
            const html = res.data
            const $ = cheerio.load(html)
            let articles = {}
            $('[data-varname="__STATE__"]').each(function () {
                const element = $(this).first().text()
                const string = JSON.parse(element)
                articles = string
            })
            const productsArray = Object.keys(articles).filter(key => key.length <= 18 && key.length >= 15)
            const filtered = productsArray.map(e => {
                const productObj = articles[e]
                const { productName, brand, link } = productObj

                let image = e + '.items({\"filter\":\"ALL_AVAILABLE\"}).0'
                let imageObj = articles[image]
                const { images } = imageObj
                image = images[0].id
                imageObj = articles[image]
                const { imageUrl } = imageObj

                const priceObjName = '$' + e + '.items({\"filter\":\"ALL_AVAILABLE\"}).0.sellers.0.commertialOffer'
                const priceObj = articles[priceObjName]
                let { spotPrice } = priceObj

                const lowPriceObjName = '$' + e + '.priceRange.sellingPrice'
                const lowPriceObj = articles[lowPriceObjName]
                let { lowPrice } = lowPriceObj

                const discountObjName = '$' + e + `.items({\"filter\":\"ALL_AVAILABLE\"}).0.sellers.0.commertialOffer.teasers.0.effects.parameters.0`
                const discountObj = articles[discountObjName]
                var withDiscount = undefined
                if (discountObj) {
                    withDiscount = spotPrice * (1 - (Number(discountObj.value) / 100))
                }

                var basePrice = undefined
                if (lowPrice > 100000) {
                    basePrice = lowPrice
                } else {
                    basePrice = spotPrice
                }
                if (lowPrice >= spotPrice) {
                    if (lowPrice > 100000) {
                        spotPrice = lowPrice
                        lowPrice = undefined
                    } else {
                        lowPrice = undefined
                    }
                }
                const tempObj = { productName, brand, link, imageUrl, lowPrice, spotPrice, withDiscount }
                return (tempObj)
            })
            console.clear()
            console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
            const temporal = JSON.stringify(articles)
            // fs.writeFile('bug-precio-iphones.json', temporal, (err) => {
            //     if (err) throw err;
            //     console.log('The file has been saved!');
            // })
            response.status(201).json({ search, page, URL, filtered })
        }).catch((err) => console.log('hubo un error\n' + err))
})
// 5306


















app.listen(8000, () => console.log('running'))










