const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const express = require('express')
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
            $('div.dib').each(function () {
                const alt = $(this).find('img').attr('alt')
                const url = $(this).find('img').attr('src')
                articles.push({ alt, url })
                console.log(url);
            })
            console.log(articles);
            response.status(201).json({ search, page, URL, articles })
        }).catch((err) => console.log(err))
})
















app.listen(8000, () => console.log('running'))










