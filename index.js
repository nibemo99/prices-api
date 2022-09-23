const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const { type } = require('os')
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
                return ({ productName, brand, link })
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










