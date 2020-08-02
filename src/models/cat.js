
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
    image: {
        type: String
    },
    parent: {
        type: String,
        required: false,
        default : null,
    },
    tree:[{
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


catSchema.statics.findByParent = async (parentName, shop) => {
     try {
        return  await Cat.find( {parent: parentName, tree: shop} ).select({_id:1, name:1})
       
     } catch (e) {
     return null    }
}



catSchema.pre('remove', async function (next) {
    const cat = this
    const fs = require('fs');
   if(cat.image)
   {
        var filePath = 'public/uploads/'+cat.image; 
      //  console.log(filePath)
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