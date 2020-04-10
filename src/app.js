const express   = require('express');
require('./db/mongoose')
const userRouter = require('./routers/user')
//const taskRouter = require('./routers/task')
 
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

app.use(userRouter)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

module.exports = app