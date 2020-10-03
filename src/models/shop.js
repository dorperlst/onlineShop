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
    images: [
        {
        type: String,
        trim: true
    }],
      images_url: [{
        type: String,
         trim: true
    }],
    logos: [
        {
        type: String,
        trim: true
    }],
    abouts: [{
        value: { type: String,trim: true},  
        title: {type: String, max: 50} 
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    },
    address: {
        type: String,
        trim: true
    },
        
    lat: {
        type: String,
        trim: true
    },
    lat: {
        type: String,
        trim: true
    },
    long: {
        type: String,
        trim: true
        
    }
},
{
    timestamps: true
})
 
const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop