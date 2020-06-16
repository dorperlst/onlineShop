
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
        default : undefined,
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


catSchema.statics.findByParent = async (parentName) => {
     try {
        const cats = await Cat.find({parent:parentName})
        return cats
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