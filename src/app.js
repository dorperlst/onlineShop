const express   = require('express');
require('./db/mongoose')
const multer = require('multer')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const taskRouter = require('./routers/task')

 
const path = require('path')
const hbs = require('hbs')
 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();
 
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(taskRouter)
app.use(userRouter)
app.use(productRouter)


 


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

app.get('', (req, res) => {
    res.render('index', {
        title: 'products',
        name: 'online shop'
    })
})
module.exports = app