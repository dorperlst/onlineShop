
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
   
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }]
    ,
    attributes:[ {
        type: String,
        trim: true
    }],
    details:[ {
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: true,
        trim: true
    },
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