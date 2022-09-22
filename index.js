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
            const articles = []
            $('[data-varname]').each(function () {
                // const alt = $(this).attr('alt')
                // const url = $(this).attr('src')
                const attributes = $(this).attr()
                articles.push({ attributes })
            })
            console.clear()
            console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
            console.log((res));
            const string = JSON.stringify(res.data)
            // fs.writeFile('request.html', res.data, (err) => {
            //     if (err) throw err;
            //     console.log('The file has been saved!');
            // })
            response.status(201).json({ search, page, URL, articles })
        }).catch((err) => console.log('hubo un error'))
})
















app.listen(8000, () => console.log('running'))










