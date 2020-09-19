const mongoose = require('mongoose')

const orderProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        trim: true
    },
    count:
    {
        type: Number,
        required: true
    }
    , price:
    {
        type: Number,
        required: false
    }
} )

const orderSchema = new mongoose.Schema({
    products: [orderProductSchema],
    status: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: String
    },
    shop: {
        type: String,
        required: true
        
    },
    details:
    {
        type: String
        
    },
    total:
    {
        type: Number
        
    },
    totalItems:
    {
        type: Number
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

orderSchema.statics.userOrder = async (owner) => {
     var orders = await Order.find({ owner })

    if (!orders) {
        orders.push(new Order({owner:owner,products:[]}))
        
    }
    return orders
}

orderSchema.statics.productInOrder = async function (shop, owner, productId ) {
    try {
        var params = [ {shop: shop, owner : owner, status:0 }]
        const match = { $and: params } 
        var order= await Order.findOne(match);
    
        if(!order)
            return 0
        var prod = order.products.find(x => x.product.toString() === productId)
        if(prod)
            return  prod.count
        else
            return  0
    }
   catch(e){}
  
}

orderSchema.statics.orderStats = async (id, shop) => {
 
    var params = [ {shop: shop, owner : id, status:0 }]
    var limit = 10 
    var sort = { "timestamps": -1,"status":-1 }
    const match = { $and: params } 
   
    try {
        const stats = await Order.aggregate([
            { $match : match } ,
          { "$unwind": "$products" }, 
        {
           $lookup: {
            from: "products",
            localField: 'products.product',
            foreignField: "_id", 
                as: "items"
           }
        } 
        ,{ "$unwind": "$items" }, 
           { "$project": { 
               "id": id,  
               "value": { "$multiply": [
                   { "$ifNull": [ "$products.count", 0 ] }, 
                   { "$ifNull": [ "$items.price", 0 ] } 
               ]},
               "items": { $sum: "$products.count" },


           }}, 
           { "$group": { 
               "_id": "$id", 
               "total": { "$sum": "$value" } ,
               "totalItems": { "$sum": "$items" }
           }}
       ])
       return stats.length >0 ? stats[0] : {total:0, totalItems:0}
      
     } catch (e) {
        console.log(e)
       return null
    }
    
}

const statusEnum = {
    OPEN: 0,
    PAID: 1,
    CLOSE: 2
}
 
orderSchema.statics.statusEnum = statusEnum
const Order = mongoose.model('Order', orderSchema)
const OrderProduct = mongoose.model('OrderProduct', orderProductSchema)
module.exports = {Order,OrderProduct}