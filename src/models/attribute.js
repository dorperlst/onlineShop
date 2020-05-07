
const mongoose = require('mongoose')

const attributeSchema = new mongoose.Schema({
   
    attributes:[  {
        name: {
            type:String,
            required: true,
            trim: true },   
        description: {
            type:String,
            required: true,
            trim: true } }],
    
} )
 
            
 
const Attribute = mongoose.model('Attribute', attributeSchema)

module.exports = Attribute