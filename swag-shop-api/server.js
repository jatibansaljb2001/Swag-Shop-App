var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cors = require('cors')
var db = mongoose.connect('mongodb://localhost/swag-shop', { useNewUrlParser: true, useUnifiedTopology: true })

var Product = require('./model/product')
var WishList = require('./model/wishlist')
const { request, response } = require('express')
const wishlist = require('./model/wishlist')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/product', (request, response) => {
    var product = new Product()
    product.title = request.body.title
    product.price = request.body.price
    product.save((err, savedProduct) => {
        if (err) {
            response.status(500).send({ err: "Could not save product" })
        } else {
            response.send(savedProduct)
        }
    })
})

app.get('/product', (request, response) => {
    Product.find({}, (err, products) => {
        if (err) {
            response.status(500).send({ err: "Could not fetch products" })
        } else {
            response.send(products)
        }
    })
})

app.get('/wishlist', (request, response) => {
    WishList.find({}).populate({ path: 'products', model: 'Product'}).exec((err, wishLists) => {
        if (err) {
            response.status(500).send({ err: "Could not fetch wishlist" })
        } else {
            response.send(wishLists)
        }
    })
})

app.post('/wishlist', (request, response) => {
    var wishlist = new WishList()
    wishlist.title = request.body.title
    wishlist.save((err, savedWishlist) => {
        if (err) {
            response.status(500).send("Could Not save wishlist")
        } else {
            response.send(savedWishlist)
        }
    })
})

app.put('/wishlist/product/add', (request, response) => {
    Product.findOne({ _id: request.body.productId }, (err, product) => {
        if (err) {
            response.status(500).send({ err: "Enter a valid Product Id" })
        } else {
            WishList.update({ _id: request.body.wishListId }, { $addToSet: { products: product._id } }, (err, wishList) => {
                if(err){
                    response.status(500).send({err: "Could not  add product to wishlist"})
                }else{
                    response.send("Successfully Submitted to wishList")
                }
            })
        }
    })
})

app.listen(3004, () => {
    console.log('Swag Shop API is running on port 3004....')
})