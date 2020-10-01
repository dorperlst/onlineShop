
const mongoose = require('mongoose')
const Cat = require('../models/cat')

const limit = 5
const promtionLimit = 5

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
         trim: true
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
    },
    images: [{
        type: String,
        required: true,
        trim: true
    }],
    images_url: [{
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
            trim: true }] 
    }],
    
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
        var filePath = 'public/uploads/'+ product.images[i]; 
        try
        {
            fs.unlink(filePath, (err) => {
                if (!err) 
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
    var sort = {  }
    const pageNum =  query.pageNum? parseInt(query.pageNum) : 1
    if(pageNum < 1)
        return
    const skip = (pageNum -1) * limit  
 
    if (query.category &&  query.category != 'All') 
    {
        var catName= query.category.replace("%26","&").trim()
        var cats =  await Cat.find( { tree: { $all: catName } },{_id:0,name:1}).select({_id:0,name:1}); //,
        var prodCat=[]
        cats.forEach((cat) => prodCat.push(cat.name))
        params.push( { category: { $in: prodCat } } )
    }

    if (query.name)  
        params.push(  { name: query.name  } )
    if (query.pricefrom)  
        params.push(  { price:{"$gte":   parseInt(query.pricefrom)}  } )
    if (query.priceto)  
        params.push(  { price:{"$lte":  parseInt( query.priceto)}  } )
    if (query.tag)  
            params.push( {  "tags":query.tag } )
    
    if (query.attributes)  
    { 
       
        var att = JSON.parse(query['attributes']);
        for(i=0; i <att.length; i++)
            params.push( {  "attributes.name":att[i][0], "attributes.values": { "$in":[att[i][1]]} } )
    }
  
    const match = { $and: params } 
    if (query.sortBy) {
        const parts = query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    else
         sort = { "timestamps": -1 }
    
    const products =  await Product.find(match).sort(sort).limit( parseInt(limit) ).skip( skip )
    
    const info = await  Product.aggregate([
        { $match : match },
        { "$group": {
           "_id": null,
           "max": { "$max": "$price" },
           "min": { "$min": "$price" },
           "count":{"$sum":1}
        }}
     ]);
  
     var productInfo =info.length >0 ? {totalRows: info[0].count, max: info[0].max, min :info[0].min}:
     {totalRows: 0, max: 0, min : 0}
     var page =  parseInt(productInfo.totalRows / limit);
     if(productInfo.totalRows % limit > 0)
        page +=1; 
    productInfo.pageNum = page

    const product_att = await Product.aggregate([
        { $match : match },
        { "$unwind": "$attributes" }, 
        { "$group": { 
                "_id": {
                    "name": "$attributes.name", 
                    "values": "$attributes.values"
                } 
        }},
        { "$unwind": "$_id.values" },
        { "$group": { 
            "_id": "$_id.name", 
            "att": { 
                "$addToSet":  
                    "$_id.values"
            }, 
            "values":{
                         $push:{
                             value:"$_id.values" ,
                             count :{ "$sum": 1}
                             
                         }
                     },
                 
         }},
        { "$sort": { "value.name": 1 ,"values.count": 1 } },

   ])
     
    const promotionParams=[ {shop: shop },{  "promotion":true }] 
    const promotionMatch = { $and: promotionParams } 
    var promotion ={}
    if(promo)
          promotion =  await Product.find(promotionMatch).sort(sort).limit( promtionLimit)
   
    return {products, promotion, product_att, productInfo}
}

const Product = mongoose.model('Product', productSchema)
module.exports = Product