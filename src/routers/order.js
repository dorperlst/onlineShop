const express = require('express')
const OrderObj = require('../models/order')

const Product = require('../models/product')
const Order = OrderObj.Order
const OrderProduct = OrderObj.OrderProduct
const authObj = require('../middleware/auth')
const auth = authObj.auth
const router = new express.Router()
var multer = require('multer'); 


router.post('/orders', multer().none(), auth , async function (req, res, next) {
 
    var product = await Product.findById(req.body.product)
    if (!product)
        res.status(400).send('product not found')
 
    try {
        var order = await Order.findOne({ owner :  req.user._id, shop : req.body.shop,  status:  Order.statusEnum.OPEN })
        if (!order) {
            order = new Order()
            order.shop = req.body.shop
            order.owner= req.user._id
            order.products= []
        }
        var user =req.user
        var userOrders= user.orders ? user.orders: []
        var  orderProduct = null;
        
        order.products.forEach(function (product){
            if(product.product.toString()=== req.body.product)
            { 
                orderProduct = product
                orderProduct.count =  parseInt(orderProduct.count)+     parseInt(req.body.count)
                
            }
        })

        if(orderProduct == null)
        {
            orderProduct =  new OrderProduct()
            orderProduct.price = product.price
            orderProduct.count = req.body.count
            orderProduct.product = req.body.product
            order.products.push(orderProduct)
        }
    
        if(!userOrders.includes(order._id))
            userOrders.push(order._id)
        user.orders = userOrders
    
            await user.save()

            await order.save()
        var stats= await Order.orderStats(user._id,req.body.shop )
            res.status(200).send(stats)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
 

// GET /orders?completed=true
// GET /orders?limit=10&skip=20
// GET /orders?sortBy=createdAt:desc
router.get('/orders', auth, async (req, res) => {
    // const match = {}
    // const sort = {}

    // if (req.query.completed) {
    //     match.completed = req.query.completed === 'true'
    // }

    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    try {
        await req.user.populate({
            path: 'orders',
            populate: {
                path: 'products.product',
                model: 'Product'
              } 
        }).execPopulate()
        res.send(req.user.orders)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findOne({ _id, owner: req.user._id })

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/orders', auth, multer().none(), async (req, res) => {
    try {
            var products = JSON.parse(req.body.products)
            var order = await  Order.findById( req.body.id)

            order.products.forEach(async function (orderproduct){
                var p = products.find(o => o.id === orderproduct.product._id.toString());
                if(p)
                    orderproduct.count = p.count
            })
            order.save()
            
            res.send("update successfully")

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/orders/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!order) {
            res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router