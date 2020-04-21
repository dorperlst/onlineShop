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
    , orderPrice:
    {
        type: Number,
        required: true
    }
 
} )

const orderSchema = new mongoose.Schema({
    products: [orderProductSchema],
    completed: {
        type: Boolean,
        default: false
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
    console.log('---------------'+owner)
    var orders = await Order.find({ owner })

    if (!orders) {
        orders.push(new Order({owner:owner,products:[]}))
        
    }
    console.log('-------ooooooooooooooo--------'+orders)

    return orders
}
const Order = mongoose.model('Order', orderSchema)
const OrderProduct = mongoose.model('OrderProduct', orderProductSchema)


module.exports = {Order,OrderProduct}