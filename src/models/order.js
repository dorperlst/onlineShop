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


orderSchema.statics.orderStats = async (owner, shop) => {
    
    var params = [ {shop: shop }]
    params.push(  { owner: owner } )
    params.push(  { status: statusEnum.OPEN } )
    const match = { $and: params } 

    var stat = await Order.aggregate([
         { $match : match } ,
        { "$unwind": "$products" }, 
        { "$project": { 
            "number": 1,  
            "value": { "$multiply": [
                { "$ifNull": [ "$products.count", 0 ] }, 
                { "$ifNull": [ "$products.price", 0 ] } 
            ]},
            "items": { $sum: "$products.count" }
        }}, 
        { "$group": { 
            "_id": "$number", 
            "total": { "$sum": "$value" } ,
            "totalItems": { "$sum": "$items" }

        }}
    ])
   return stat.length >0 ? stat[0] : {total:0,totalItems:0}
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