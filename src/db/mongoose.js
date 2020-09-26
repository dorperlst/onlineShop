const mongoose = require('mongoose')

try{
    var db = mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    
    module.exports = db
}

catch(e){

console.log(e)

}