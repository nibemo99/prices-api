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



// Éxito
app.get('/exito/:id', (request, response) => {
    const search = request.params.id
    const searchParsed = search.replaceAll(' ', '%20')
    const { page } = request.query
    const URL = (page)
        ? `https://www.exito.com/${searchParsed}?_q=${searchParsed}&map=ft&page=${page}`
        : `https://www.exito.com/${searchParsed}?_q=${searchParsed}&map=ft`
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
            // console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
            // Code to save the big json files in dev
            // const temporal = JSON.stringify(articles)
            // fs.writeFile('bug-precio-iphones.json', temporal, (err) => {
            //     if (err) throw err;
            //     console.log('The file has been saved!');
            // })
            response.status(200).json({ searchParsed, page, URL, filtered })
        })
        .catch((err) => console.log(err))
})



// Alkosto
app.get('/alk/:id', (request, response) => {
    const search = request.params.id
    const { page } = request.query
    const URL = (page)
        ? `https://www.alkosto.com/search/?text=${search}&page=${page}&pageSize=25&sort=relevance`
        : `https://www.alkosto.com/search/?text=${search}`

    axios.get(URL)
        .then((res) => {
            const html = res.data
            const $ = cheerio.load(html)
            let articles = []

            $('.product__list--item').each(function () {
                const href = `https://www.alkosto.com${$(this).find('a.js-product-click-datalayer').attr('href')}`
                const title = $(this).find('a.js-product-click-datalayer').attr('title')

                const image = `https://www.alkosto.com${$(this).find('img').attr('data-src')}`

                const oldPrice = $(this).find('.product__price--discounts__old').text().trim()
                const todayPrice = $(this).find('.price').text().trim()
                const otherPrice = $(this).find('.price-contentPlp').children().first().text().trim()

                const product = { title, href, image, oldPrice, todayPrice, otherPrice }
                articles.push({ ...product })
            })
            response.status(200).json({ search, page, URL, articles })
        })
        .catch((err) => console.log(err))
})




// Falabella
app.get('/fll/:id', (request, response) => {
    const search = request.params.id
    const { page } = request.query
    const URL = (page)
        ? `https://www.falabella.com.co/falabella-co/search?Ntt=${search}`
        : `https://www.falabella.com.co/falabella-co/search?Ntt=${search}`

    axios.get(URL)
        .then((res) => {
            const html = res.data
            const $ = cheerio.load(html)

            const element = $('[id="__NEXT_DATA__"]').text()
            const elementParsed = JSON.parse(element)
            const articles = elementParsed.props.pageProps.results
            const filteredArticles = articles.map(product => {
                const { displayName, url, prices, productId } = product
                const pricesArray = prices.map(e => (e.price[0]))
                const image = `https://falabella.scene7.com/is/image/FalabellaCO/${productId}?wid=500&hei=500&qlt=70`
                return { productId, displayName, url, image, pricesArray }
            });
            response.status(200).json({ search, page, URL, filteredArticles })
        })
        .catch((err) => console.log(err))
})
















app.listen(8000, () => console.log('running'))










