
# Prices API 🧺

This project scrapes products' information from supermarket websites.

Currently the API supports searches for [exito.com](https://www.exito.com/), [alkosto.com](https://www.alkosto.com/) and [falabella.com.co](https://www.falabella.com.co/).

The API uses express for the server, axios to make http requests, and cheerio to *inspect* the server's response, to finally send back an object with all the products results from the supermarket website, this object has name, price(s), link to product and link to product image.














## API Structure:

```http
  /supermarket/:product ? apikey= & page=
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `product` | `string` | **Required**. Product to search. |
| `apikey` | `string` | Optional. Your API key. |
| `page` | `string` | Optional. Page number to search, it defaults to 1. |

Practice API key: **YeMSPx2jAMPwJUpTG5yNhFJqVFf**

## Examples:

1.  Both of the following requests are missing the API key, consequently a status code **511 Network Authentication Required** will be returned.

→ https://pricesapi.nicolasbm.dev/exito/yogurt

→ https://pricesapi.nicolasbm.dev/alkosto/iphone

2. When a valid API key is sent, we will get back an object with 3 properties:

→ https://pricesapi.nicolasbm.dev/exito/yogurt?apikey=YeMSPx2jAMPwJUpTG5yNhFJqVFf


![API object response](https://i.imgur.com/6itla9e.png)

- *searchParsed* is the search term.
- *URL* is the requested and scrapped URL from the webs.
- *filtered* is the array of products.


*Filtered* is an array of objects, with the following properties:

![Products array](https://i.imgur.com/WJLDY6m.png)

3) For Alkosto, the response structure is similar:

→ https://pricesapi.nicolasbm.dev/alkosto/iphone?apikey=YeMSPx2jAMPwJUpTG5yNhFJqVFf


![API object response](https://i.imgur.com/QYRbr0e.png)

Instead of *filtered* it's called *articles* and the product structure changes a tiny bit compared to exito's .



## Why?

Each website uses a different stack of technologies, for instance, some may use server side rendering while others, client side rendering, implying that the 'parsing' of each website is a complete distinct journey. This is still experimental so the different key names is due to the use of { destructuring } so I keep the same name conventions, each one has.

Wait, what happened to Falabella?
Well, it's not working quite reliable yet, however you can try it [here](https://pricesapi.nicolasbm.dev/falabella/iphone?apikey=YeMSPx2jAMPwJUpTG5yNhFJqVFf).

## Objectives:

- ✅ Create logic to retrieve HTML response from server.
- ✅ Parse HTML information to filter and organize it in an object, per product.
- ✅ Create parameters and query validation to prevent code injection.
- ✅ Create API key verification via query.
- ✅ Create query logger using *fs* node module.
- ⌛ Create logic to add more local supermarkets such as [d1.com.co](https://d1.com.co/), [tiendasjumbo.co](https://www.tiendasjumbo.co/), [carulla.com](https://www.carulla.com/), [superinter.com.co](https://www.superinter.com.co/).
- ⌛ Create Frontend interface using Reactjs and Tailwind to make calls to this API and provide much more interactivity.
- ⌛ Create DB to store history of prices.
- ⌛ Create login interface.
- ⌛ Provide options to alert/notify users when certain product has moved it's price.


## Thank you for reading! 🤓
Want to contact me? I'm all ears 😊 → [hello@nicolasbm.dev](mailto:hello@nicolasbm.dev)
