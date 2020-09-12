var express = require('express');
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order').Order
const Cat = require('../models/cat')
const router = new express.Router()
const multer = require('multer'); 
const ejs = require('ejs'); 
const admin = require('../middleware/auth').admin;

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
 
router.get('/product/:id', async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id}) 
    try {
        res.send({ product })
     } catch (e) {
        res.status(400).send(e)
    }
})

async function orderStats(token, shop, productId)
{
    try
    {
        const user = await User.findByToken(token);
        const orderStats = await Order.orderStats(user._id, shop )
        if(productId)
            orderStats.productInOrder = await  Order.productInOrder(shop, user._id, productId );

        return orderStats
    
    }
    catch(e){
        var t=e;
    }
    
}

router.get('/:shop/view',async (req, res) => {
    
    const shopName= req.params.shop
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    try {
            const categories = await Cat.getCategoriesTree(req.query.category, shopName);
            const products = await Product.getProducts(req.query, shopName ,true)
            
            const orderStat= await orderStats( req.session.token, shopName)
            const urlBase=`/${shopName}/view`
 
            res.render('products', { title: 'products', products: products, categories: categories, shopname: shopName, url_base: urlBase,
                username: userName, orderStat: orderStat});
        } 
    catch (e) {
         res.render('products', { title: 'products', products: [] , categories: [],shopname: req.params.shop, url_base: urlBase, username: userName});   
     }
})
 

// GET /products?completed=true
// GET /products?limit=10&skip=20
// GET /products?sortBy=createdAt:desc
// GET /products/yyyy?attributes=[["dsdsds","fsffssf"],["gggg","tttttt1"]]
router.get('/:shop/products', async (req, res) => {
    try {
        
        const products = await Product.find();
        res.send({ products })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
 

router.get('/:shop/view/:id', async (req, res) => {
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    const shop = req.params.shop
    var tree=[]
    try {
            const product = await Product.findById(req.params.id);
            
            const categories = await  Cat.getCategoriesTree(req.query.category, shop);
            categories.tree = product.tree
            const orderStat= await orderStats(req.session.token, shop, req.params.id);
            const urlBase =`${shop}/view`;
            res.render('product', { title: 'product',url_base:urlBase, tree:tree, product: product, categories: categories, shopname: shop, orderStat:orderStat, username: userName});
        } 
    catch (e) {
        const obj={} 
        res.render('product', { title: 'product', products: [] ,tree:[],categories:[],shopname: req.params.shop, username: userName});   
     }
 
})

router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        await product.remove()
        res.redirect(req.body.currentUrl);
    } catch (e) {
        console.log(e)
        res.status(500).send() 
    }
})

router.post('/products', admin, upload.array('myFiles', 12) , async  function (req, res, next) {
     const product = new Product({
        ...req.body,
        shop: req.shop.name,
        attributes: JSON.parse(req.body.attributes),
        imgattributes: JSON.parse(req.body.imgattributes),
        tags: JSON.parse(req.body.tags),
        details: JSON.parse(req.body.details),
        images : req.files.map(x => x.filename)
    })
    if((!req.body.mainimage || req.body.mainimage == "") && product.images.length >0)
        product.mainimage = product.images[0]

    const cat = await Cat.findOne({ _id: req.body.category}) 
    product.category = cat.name
    product.tree = cat.tree
    try
    {
        await product.save()
        res.redirect(req.body.currentUrl);
    }
    catch (e) {
        console.log (e)
        res.status(400).send(e)
    }
})

router.patch('/products',admin, upload.array('myFiles', 12), async function (req, res, next) {
    const allowedUpdates = ['name', 'description', 'price','mainimage',"isavailable","promotion"]
    var newimages = req.files.map(x => x.filename)
    var images = JSON.parse( req.body.images)
    const product = await Product.findById(req.body.id)
    
    allowedUpdates.forEach((update) => product[update] = req.body[update])
    var cat = await Cat.findById(req.body.category)
    product.category= cat.name
    product.tree = cat.tree
    product.images = images.concat(newimages)
    product.imgattributes = JSON.parse(req.body.imgattributes)
    product.attributes = JSON.parse(req.body.attributes)
    product.details = JSON.parse(req.body.details)
    product.tags = JSON.parse(req.body.tags)
    if((!req.body.mainimage || req.body.mainimage == "")&& product.images.length >0)
        product.mainimage=product.images[0]
    try
    {
        await product.save()
        res.redirect(req.body.currentUrl);    }
    catch (e) {
         res.status(400).send(e)
    }
})
  
module.exports = router

 