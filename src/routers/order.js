const express = require('express')
const OrderObj = require('../models/order')
const Order = OrderObj.Order
const OrderProduct = OrderObj.OrderProduct
const authObj = require('../middleware/auth')
const auth = authObj.auth
const router = new express.Router()
var multer = require('multer'); 


router.post('/orders', multer().none(), auth ,async function (req, res, next) {
console.log (req.body)
    var orders = await Order.find({ owner :  req.user._id})
    var order = orders[0]

    if (!order) {

        order = new Order()
        order.owner= req.user._id
        order.products= []
    }
  
    const orderProduct =  new OrderProduct()
    orderProduct.orderPrice = req.body.orderPrice
    orderProduct.count = req.body.count
    orderProduct.product = req.body.product
    order.products.push(orderProduct)
    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
 

// GET /orders?completed=true
// GET /orders?limit=10&skip=20
// GET /orders?sortBy=createdAt:desc
router.get('/orders', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

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

router.patch('/orders/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const order = await Order.findOne({ _id: req.params.id, owner: req.user._id})

        if (!order) {
            return res.status(404).send()
        }

        updates.forEach((update) => order[update] = req.body[update])
        await order.save()
        res.send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/orders/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!order) {
            res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router