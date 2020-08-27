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
const ejs = require('ejs')
const path = require('path')
const hbs = require('hbs')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();
const session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));

app.set('view engine', 'ejs')
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


app.get('/help', (req, res) => {
          res.render('help', {
         title: 'about'
    })
})


app.get('/about', (req, res) => {

 
    res.render('about', {
   title: 'about'
})
})





 

module.exports = app