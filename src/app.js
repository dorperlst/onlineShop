require('./db/mongoose')

const express   = require('express');
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')

const productRouter = require('./routers/product')
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



app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'login',
        name: 'online shop'
    })
})

app.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'admin',
        name: 'online shop'
    })
})

app.get('/shop', (req, res) => {
    sess = req.session;
console.log('---------------------------'+sess.token)
     res.render('products', {
        title: 'products',
        name: 'online shop'
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'products',
        name: 'online shop'
    })
})

module.exports = app