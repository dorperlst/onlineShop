const mongoose = require('mongoose')




// create_time: "2020-08-10T14:21:09Z"
// id: "6V045668P0492830T"
// intent: "CAPTURE"
// links: [{…}]
// payer: {email_address: "sb-r7cjw2837407@personal.example.com", payer_id: "7YTE8U9N5YWP6", address: {…}, name: {…}}
// purchase_units: [{…}]
// status: "COMPLETED"
// update_time: "2020-08-10T14:21:35Z"









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
        ,   { "$unwind": "$items" }, 


           { "$project": { 
               "id": id,  
               "value": { "$multiply": [
                   { "$ifNull": [ "$products.count", 0 ] }, 
                   { "$ifNull": [ "$items.price", 0 ] } 
               ]},
               "items": { $sum: "$products.count" }
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

// orderSchema.statics.orderStats = async (owner, shop) => {
//     // var id =req.user._id ;
//     var params = [ {shop: "yyyy", owner : "5f05e450187496164c500c16", status:0 }]
//     var limit = 10 
//     var sort = { "timestamps": -1,"status":-1 }
    
 
//     const match = { $and: params } 
   
//     try {
//         const orders = await Order.aggregate([
//             { $match : match } ,
//           { "$unwind": "$products" }, 

//         {
//            $lookup: {
//             from: "products",
//             localField: 'products.product',
//             foreignField: "_id", 
//                 as: "items"
//            }
//         } 
//         ,   { "$unwind": "$items" }, 


//            { "$project": { 
//                "id": id,  
//                "value": { "$multiply": [
//                    { "$ifNull": [ "$products.count", 0 ] }, 
//                    { "$ifNull": [ "$items.price", 0 ] } 
//                ]},
//                "items": { $sum: "$products.count" }
//            }}, 
//            { "$group": { 
//                "_id": "$id", 
//                "total": { "$sum": "$value" } ,
//                "totalItems": { "$sum": "$items" }
   
//            }}
//        ])
//     }

// catch(e)
// {
//     console.log(e);
// }
  
//    return stat.length >0 ? stat[0] : {total:0,totalItems:0}
// }



const statusEnum = {
    OPEN: 0,
    PAID: 1,
    CLOSE: 2
}
 
orderSchema.statics.statusEnum = statusEnum
 


const Order = mongoose.model('Order', orderSchema)
const OrderProduct = mongoose.model('OrderProduct', orderProductSchema)



module.exports = {Order,OrderProduct}