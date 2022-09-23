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
                const product = articles[e]
                const { productName, brand, link } = product

                let image = e + '.items({\"filter\":\"ALL_AVAILABLE\"}).0'

                let imageObj = articles[image]
                const { images } = imageObj
                image = images[0].id

                imageObj = articles[image]
                let { imageUrl } = imageObj

                const tempObj = { productName, brand, link, imageUrl }
                return (tempObj)
            })
            console.clear()
            console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
            // const temporal = JSON.stringify(articles)
            // fs.writeFile('request.json', temporal, (err) => {
            //     if (err) throw err;
            //     console.log('The file has been saved!');
            // })
            response.status(201).json({ search, page, URL, filtered })
        }).catch((err) => console.log('hubo un error'))
})
















app.listen(8000, () => console.log('running'))










