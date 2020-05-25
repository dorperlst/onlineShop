require('./db/mongoose')

const express   = require('express');
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')
const categoryRouter = require('./routers/cat')
const shopRouter = require('./routers/shop')
const paymentRouter = require('./routers/payment')
const productRouter = require('./routers/product')
const authObj = require('./middleware/auth')
const admin = authObj.admin

const path = require('path')
const hbs = require('hbs')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();
const session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(shopRouter)

app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)
app.use(categoryRouter)
app.use(paymentRouter)

 
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'login'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about'
    })
})

app.get('/admin', admin, (req, res) => {
    var userName = req.session.name  
    if (userName == undefined)
        window.location.href="/login"
    res.render('admin', {
        title: 'admin',
        username: userName
    })
})

app.get('/:shop/view/:id', (req, res) => {
 
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    
    res.render('product', {
        title: 'product',
        name: 'online shop',
        username: userName,
        shopname: req.params.shop,
        productid: req.params.id

    })
})

app.get('/:shop/view', (req, res) => {
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    res.render('products', {
        title: 'products',
        shopname: req.params.shop,
        username: userName
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'products',
        name: 'online shop'
    })
})

module.exports = app