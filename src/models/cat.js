
const mongoose = require('mongoose')

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
   
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: undefined,
        trim: true
    },
    image: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cat',
        required: false,
        default : undefined,
        trim: true
    }
   
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // }
}, {
    timestamps: true
})

catSchema.pre('remove', async function (next) {
    const cat = this
    const fs = require('fs');
    for (i=0 ; i < cat.images.length; i++)
    {
        var filePath = 'public/uploads/'+cat.images[i]; 
        console.log(filePath)
 
        try
        {
             
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log('successfully deleted ');
              });
        }
        catch(e){
            
        }      
    }

    next()
})

const Cat = mongoose.model('Cat', catSchema)

module.exports = Cat