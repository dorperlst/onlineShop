const express = require('express')
const multer = require('multer')
const Shop = require('../models/shop')
const authObj = require('../middleware/auth')
const auth = authObj.auth
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
    }
  });
   
  const upload = multer({
    storage: storage ,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
  })


router.get('/shops', async (req, res) => {
    const shops = await Shop.find()
    res.send({ shops})
    
})

router.post('/shops', upload.array('myFiles', 12),async  function (req, res, next) {

  console.log(req.body)
    const shop = new Shop(req.body)
    shop.images = req.files.map(x => x.filename)

    try {
        await shop.save()
       } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
    //redirectSession(req, res, shop)

})
 
router.patch('/shops/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.shop[update] = req.body[update])
        await req.shop.save()
        res.send(req.shop)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/shops/me', auth, async (req, res) => {
    try {
        await req.shop.remove()
        sendCancelationEmail(req.shop.email, req.shop.name)
        res.send(req.shop)
    } catch (e) {
        res.status(500).send()
    }
})

 

 

router.delete('/shops/me/avatar', auth, async (req, res) => {
    req.shop.avatar = undefined
    await req.shop.save()
    res.send()
})

router.get('/shops/:id/avatar', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)

        if (!shop || !shop.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(shop.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router