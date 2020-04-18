const mongoose = require('mongoose')
console.log(process.env.MONGODB_URL)
var db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

module.exports = db