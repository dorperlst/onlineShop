const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const Product = require('../models/product')
const Order = require('../models/order').Order

const User = require('../models/user')
const Contact = require('../models/contact')
const Cat = require('../models/cat')
const Shop = require('../models/shop')

const authObj = require('../middleware/auth')
const auth = authObj.auth
const { sendWelcomeEmail, sendContactEmail, sendCancelationEmail } = require('../emails/account')
const { admin } = require('../middleware/auth')
const { send } = require('@sendgrid/mail')
const router = new express.Router()


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/users');
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


router.get('/users', async (req, res) => {
    const user = await User.find()
    res.send({ user })
    
})
router.delete('/contact/:shop/', multer().none(), auth, async (req, res) => {
    try {
        var contact = await Contact.findByIdAndDelete(req.body.id)
        res.send(contact)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:shop/account', auth, async (req, res) => {
    const shop = req.params.shop

    const categories = await  Cat.getCategoriesTree(req.query.category, shop) 
    const orderStat=  await Order.orderStats(req.user._id, shop )
    const urlBase=`/${shop}/view`
    await req.user.populate({
        path: 'orders',
        match:{shop: shop},
        options: {sort:{"status": 1}},
        populate: {
            path: 'products.product  name',
            model: 'Product'
          } 
    }).execPopulate()
    res.render('account', {
        title: 'Account', categories:categories, url_base: urlBase, sb: process.env.CLIENT_ID, shopname: req.params.shop, username: req.user.name ,orderStat: orderStat,
        user: req.user
 
    })
})

async function getShopOrders(shop, status)   {
    var params = [ {shop: shop }]
    var limit = 10 
    var sort = { "owner":-1,"status":1,"timestamps": -1 }
 
    if (status)  
        params.push( { status: status } )
      
    const match = { $and: params } 
   
    try {
     const orders = await Order.aggregate([
        { $match : match } ,

        {"$unwind":"$products"},
        {
           $lookup: {
            from: "products",
            localField: 'products.product',
            foreignField: "_id", 
                as: "items"
           }
        }  
        ,
        {
            $addFields: { "items.count": "$products.count" }
          },
          {
            "$unwind": "$items"
        }, 
  {
      "$group": {
          "_id": {"id":"$_id","status":"$status","status":"$status","createdAt":"$createdAt","updatedAt":"$createdAt"},

          "products": {
              "$push": {
                   "name": "$items.name",
                  "count": "$items.count",
                  "price": "$items.price"
              }
          }
      }
  },
    
  { $sort: sort }
      ])
   
      return orders;
      
  } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

router.post('/users/:shop/contact', multer().none(), async (req, res) => {
    try {
        const contact = new Contact (req.body)
        contact.shop = req.params.shop
        await contact.save()
        // keep
      //  sendContactEmail(req.body.email, req.body.name,"Your msg is recived")
        res.send({ msg: "msessage send successfully" })
     } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/users/contact', admin, multer().none(), async (req, res) => {
    try {
        const contact = await Contact.findById(req.body.id)
        if(req.query.shop != contact.shop)
            return;

        contact.reply = req.body.reply
        sendContactEmail(contact.email, contact.name, contact.reply)
        await contact.save()
       
        res.send({ msg: "msessage as been send successfully" })
     } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/:shop/signup', async (req, res) => {
    const categories = await  Cat.getCategoriesTree(req.query.category, req.params.shop)
    
    const urlBase=`/${req.params.shop}/view`

    var userName = req.session.name != undefined ? req.session.name : 'Guest'

    res.render('signup', {
        title: 'signup', categories:categories, shopname: req.params.shop, url_base: urlBase,  username: userName 
    })
})

router.get('/:shop/contact',auth, async (req, res) => {
    const categories = await  Cat.getCategoriesTree(req.query.category, req.params.shop)
     const shop = await Shop.findOne({ name : req.params.shop })
    
    const urlBase=`/${req.params.shop}/view`

    var userName = req.session.name != undefined ? req.session.name : 'Guest'

    const orderStat=  await Order.orderStats(req.user._id,  req.params.shop )

    res.render('contact', {
        title: 'contact',categories:categories,shopname: req.params.shop, address: shop.address, url_base: urlBase,  username: userName,orderStat: orderStat
    })
})

router.get('/admin', admin, async (req, res) => {
    var userName = req.session.name  
    if (userName == undefined)
        window.location.href="/login"
    const shopName = req.shop.name;
    var tree = [shopName]
    try {
            const urlBase="/admin"
            const orders= await getShopOrders(shopName)
            const contacts = await Contact.find({shop: shopName })
            const categories = await Cat.getCategoriesTree(req.query.category, shopName)
            const products = await Product.getProducts(req.query, shopName ,true)
            categories.allcategories = await  Cat.find(({ tree: { $in: [shopName] }} )) 
            res.render('admin', { title: 'admin', orders: orders, url_base: urlBase, products: products, contacts: contacts, categories: categories, shopname: shopName, tree:tree, username: userName});
        } 
    catch (e) {
        res.redirect('/login');
     }
})

router.get('/contact',admin, async (req, res) => {

    const contact = await Contact.find({shop:req.shop.name})
    var userName = req.session.name != undefined ? req.session.name : 'Guest'

    res.render('contact', {   title: 'contact', contact: contact, shopname: req.shop.name, username: userName})
})

router.post('/users', upload.single('avatar'), async function (req, res, next) {
    const user = new User(req.body)
    if(req.file!= undefined)
        user.image = req.file.filename

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        redirectSession(req, res, user, href)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})
 // todo confermation mail
router.post('/login', multer().none(), async (req, res) => {
    try {
        var shop = await Shop.findOne();
        const url=`/${shop.name}/view`
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user)
            res.redirect(url);
        else
        {
            const redirect =  req.body.currentUrl?  req.body.currentUrl : url;
            redirectSession(req, res, user,redirect)
        }
          
    } catch (e) {
        res.status(400).send(e)
    }
})

async function redirectSession(req, res, user, href){
    const token = await user.generateAuthToken()   
    var sess = req.session;
    sess.token = token
    sess.name = user.name
    var hour = 360000000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour
    res.redirect(href);
}

router.post('/users/logout', multer().none(),  auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.session.token
    })
    logout(req, req.body.currentUrl, res)
})

async function logout(req, href, res){
    req.session.token=''
    req.session.username = ''
    req.session.cookie.expires = new Date(Date.now())
    req.session.cookie.maxAge = 0
    try{
        await req.user.save()
    res.redirect(href);

    }
    catch (e) {
        res.status(500).send()
    }
}




router.post('/users/logoutAll', multer().none(), auth, async (req, res) => {
   
    req.user.tokens = []
    logout(req, req.body.currentUrl, res)
     
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/:shop/account', auth,multer().none(), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'last', 'email', 'phone','address']
    allowedUpdates.forEach((update) => req.user[update] = req.body[update])
    
    try {
        
        res.redirect("/"+req.params.shop+"/account")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
 

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router