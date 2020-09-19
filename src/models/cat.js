
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

catSchema.statics.getCategoriesTree = async (category, shop) => {
        const categories = {}
        var name = "";
        var tree = []
    try {
        if (category && category != 'All') 
        {
            name = category
            const selectedCat = await Cat.findOne({name:name, tree: { $in: [shop] } })
            tree = selectedCat.tree
            categories.cur = selectedCat.name
            categories.curId = selectedCat.id
            categories.tree = selectedCat.tree;
        }
        else
            categories.tree = [shop];
    
        const params = [{parent: name},{parent: null}, {name: { $in: tree } }  ]
        const match = { $or: params } 
        const params2 = [match, {tree: { $in: [shop] } }  ]
        const match2 = { $and: params2 } 
        
        const cats =  await Cat.aggregate( [
            { $match : match2 } ,
            {   
                $project: 
                {
                    name: 1,
                    parent:1,
                    cat: {
                        $cond: { if: { $eq: [ "$parent", null ] }, then: "cat", else: "sub" }
                    }
                }
            },
            {
                $group :
                    {
                    _id : "$cat",
                    entries:{
                        $push:{
                            name:"$name",
                            class: {
                                $cond: { if: { $eq: [ "$parent", name ] }, then: "sub", else: "tree" }
                            }                
                        }
                    }
                }
            },
            {$sort:{_id:1}}
        ])
    
        categories.categories = cats;
        return categories;      
    } catch (e) {
    return null    }
}


catSchema.pre('remove', async function (next) {
    const cat = this
    const fs = require('fs');
   if(cat.image)
   {
        var filePath = 'public/uploads/'+cat.image; 
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