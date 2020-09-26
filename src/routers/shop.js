const express = require('express')
const multer = require('multer')
const Shop = require('../models/shop')
const authObj = require('../middleware/auth')
const auth = authObj.auth
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order').Order
const { admin } = require('../middleware/auth')
const Cat = require('../models/cat')
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

router.get('/:shop/about', async (req, res) => {
    const categories = await  Cat.getCategoriesTree(req.query.category, req.params.shop)
    const shop = await Shop.findOne({ name : req.params.shop })
    
    const urlBase=`/${req.params.shop}/view`

    var userName = req.session.name != undefined ? req.session.name : 'Guest'

    const orderStat= await User.orderStats(req.session.token,req.params.shop)

    res.render('about', { title: 'About' , categories: categories, shopname: req.params.shop, shop: shop, url_base: urlBase,  username: userName,orderStat: orderStat  })
})
 
router.get('/shops', async (req, res) => {
    const shops = await Shop.find()
    res.send({ shops})
    
})

router.get('/shop', admin, async (req, res) => {
   
    res.send(req.shop)

    
})

router.post('/shops',auth, upload.array('myFiles', 12), async  function (req, res, next) {

    const shop = new Shop(req.body)
    shop.admin=req.user._id;
    shop.images = req.files.map(x => x.filename)

    try {
        await shop.save()
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})
 
router.patch('/shops', admin, upload.array('myFiles', 12) ,async (req, res) => {

    shop = req.shop
    const allowedUpdates = ['description', 'address','lat', 'long']
    var newimages = req.files.map(x => x.filename)
    var images = JSON.parse( req.body.images)
    shop.images = images.concat(newimages)
    allowedUpdates.forEach((update) => shop[update] = req.body[update])
 
    shop.abouts = JSON.parse(req.body.abouts);
    if(req.body.name != shop.name)
    {
        var oldName = shop.name;
        var newName = req.body.name;
        try {
            await Cat.updateMany(
                { tree: { $in: [oldName] }},
                { $set: { "tree.$[element]" : newName } },
                { arrayFilters: [ { "element": oldName } ] }
             )
             await Order.updateMany(
                { shop: oldName},
                { $set: { shop : newName } }
                 
             )
             


         
         } catch (e) {
            print(e);
         } 
         try {
            await Product.updateMany(
                { tree: { $in: [oldName] }},
                { $set: { "tree.$[element]" : newName,  "shop" : newName } },
                { arrayFilters: [ { "element": oldName } ] }
             )
         
         } catch (e) {

            print(e);
            res.status(400).send(e)

         } 
         shop.name = newName;
    }

    try {
         await shop.save()
         res.redirect('/admin');
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