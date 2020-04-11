const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
  
router.use(multer().array())



router.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    try {
        res.send({ product })
     } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/products', async (req, res) => {
    const product = await Product.find()
    try {
        res.send({ product })
     } catch (e) {
        res.status(400).send(e)
    }
})


 
 

router.post('/products', async (req, res) => {
    console.log(req.body)
    const product = new Product(req.body)
    try {
        await product.save()
        res.status(201).send({ product })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
 

router.get('/products/me', auth, async (req, res) => {
    res.send(req.product)
})

router.patch('/products/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.product[update] = req.body[update])
        await req.product.save()
        res.send(req.product)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/products/me', auth, async (req, res) => {
    try {
        await req.product.remove()
        sendCancelationEmail(req.product.email, req.product.name)
        res.send(req.product)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/products/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.product.avatar = buffer
    await req.product.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/products/me/avatar', auth, async (req, res) => {
    req.product.avatar = undefined
    await req.product.save()
    res.send()
})

router.get('/products/:id/avatar', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product || !product.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(product.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router