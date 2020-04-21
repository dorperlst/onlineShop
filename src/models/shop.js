const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
 
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        unique :true,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    }
}, {
    timestamps: true
})
 
shopSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

 
const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop