require('./db/mongoose')

const express   = require('express');
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')
 const categoryRouter = require('./routers/cat')
 const shopRouter = require('./routers/shop')
 const productRouter = require('./routers/product')
require('ejs')
const path = require('path')
const hbs = require('hbs')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();
const session = require('express-session');
app.use(session({secret: process.env.SESSION_SECRET}));

app.set('view engine', 'ejs')
app.use(express.static(publicDirectoryPath))
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(shopRouter)
app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)
app.use(categoryRouter)

app.get('/signup', async (req, res) => {
    res.render('signup', {
        title: 'signup'
    })
})


app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

app.get('/', async (req, res) => {
    res.render('login', {
        title: 'login' 
    })
})

module.exports = app