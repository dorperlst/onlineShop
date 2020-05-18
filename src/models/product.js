
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isavailable: {
        type: Boolean,
        required: false,
        default: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number 
    },
    images: [{
        type: String
    }],
    attributes:[  {
        name: {
            type:String,
            required: true,
            trim: true },   
        value: {
            type:String,
            required: true,
            trim: true } }],
    details:[  {
        name: {
            type:String,
            required: true,
            trim: true },   
        value: {
            type:String,
            required: true,
            trim: true } }],
    tags:[  {
        name: {
            type:String,
            required: true,
            trim: true }     
        }],
    category: {
        type: String,
        required: true,
        trim: true
    }, tree:[{
        type: String,
        required: true,
        trim: true
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    }
}, {
    timestamps: true
})

productSchema.pre('remove', async function (next) {
    const product = this
    const fs = require('fs');
    for (i=0 ; i < product.images.length; i++)
    {
        var filePath = 'public/uploads/'+product.images[i]; 
        console.log(filePath)
 
        try
        {
             
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log('successfully deleted /tmp/hello');
              });
        }
        catch(e){
            
        }      
    }

    next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product