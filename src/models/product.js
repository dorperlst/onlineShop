
const mongoose = require('mongoose')
const Cat = require('../models/cat')

const limit = 3
const promtionLimit = 5

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
    promotion: {
        type: Boolean,
        required: false,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number 
    },
    mainimage: {
        type: String,
        trim: true
    }
    ,
    images: [{
        type: String,
        required: true,
        trim: true
    }],
    attributes:[  {
        name: {
            type:String,
            required: true,
            trim: true },   
        values: [{
            type:String,
            required: true,
            trim: true }] }],
    
    imgattributes:[  {
        name: {
            type:String,
            required: true,
            trim: true },   
        values: [{
            value: {
                type:String,
                required: true,
                trim: true },
            img: {
                type:String,
                required: true,
                trim: true }
        
        } ] }],

    details: [{
        type: String,
        required: true,
        trim: true
    }],     
   
    tags:[{
            type:String,
            required: true,
            trim: true 
        }],
    category: {
        type: String,
        required: true,
        trim: true
    },
    shop: {
        type: String,
        required: true,
        trim: true
    },
    tree:[{
        type:String,
        required: true,
        trim: true 
    }],
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
                console.log('successfully deleted');
              });
        }
        catch(e){
            
        }      
    }

    next()
})

productSchema.statics.getProducts = async (query, shop, promo=false) => {

    var params = [ {shop: shop }]

    var sort = { "timestamps": -1 }
    const pageNum =  query.pageNum? parseInt(query.pageNum) : 1
    if(pageNum < 1)
        return
    const skip = (pageNum -1) * limit  
 
    if (query.category &&  query.category != 'All') 
    {
        var catName= query.category
        var cats =  await Cat.find( { tree: { $all: catName } },{_id:0,name:1}).select({_id:0,name:1}); //,
        var prodCat=[]
        cats.forEach((cat) => prodCat.push(cat.name))
        params.push( { category: { $in: prodCat } } )
    }

    if (query.name)  
        params.push(  { name: query.name  } )
    if (query.pricefrom)  
        params.push(  { price:{"$gte": query.pricefrom}  } )
    if (query.priceto)  
        params.push(  { price:{"$lte": query.priceto}  } )
    if (query.tag)  
            params.push( {  "tags":query.tag } )
    
    if (query.attributes)  
    { 
        var att = JSON.parse(query.attributes)
        for(i=0; i <att.length; i++)
            params.push( {  "attributes.name":att[i][0], "attributes.value": att[i][1] } )
    }
  
    const match = { $and: params } 
    if (query.sortBy) {
        const parts = query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const products =  await Product.find(match).sort(sort).limit( parseInt(limit) ).skip( skip )
    const totalRows = await  Product.find(match).count();
    
    const promotionParams=[ {shop: shop },{  "promotion":true }] 
    const promotionMatch = { $and: promotionParams } 
    var promotion ={}
    if(promo)
          promotion =  await Product.find(promotionMatch).sort(sort).limit( promtionLimit)
    var pager =  parseInt(totalRows / limit);
    if(totalRows % limit >0)
        pager +=1; 

    return {products, totalRows, pager, promotion}
}




const Product = mongoose.model('Product', productSchema)

module.exports = Product