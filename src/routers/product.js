var express = require('express');
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order').Order
const Cat = require('../models/cat')
const router = new express.Router()
const multer = require('multer'); 
const ejs = require('ejs'); 
const admin = require('../middleware/auth').admin;
// const cloudinary = require('../cloudinary/cloudinary')

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
        if(!user)
            return {total:0, totalItems:0, productInOrder :0}
        const orderStats = await Order.orderStats(user._id, shop )
        if(productId)
            orderStats.productInOrder = await  Order.productInOrder(shop, user._id, productId );

        return orderStats
    
    }
    catch(e){
        var t=e;
    }
    
}
//                    attributes=[{%22values%22:[%22size%22,%22big%22]},{%22values%22:[%22Sleeves%22,%22long%22]}]
// GET /products/yyyy?attributes=[["dsdsds","fsffssf"],["gggg","tttttt1"]]

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
        res.status(500).send(e.message)     }
})
 
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
    var params = [ {shop: shop }]
  

    var tree=[]
    try {
            const product = await Product.findById(req.params.id);
            params.push( { _id: { $ne:product._id  } } )
            const match = { $and: params } 

            const prod = await Product.aggregate(
                [   
                  { $match : match },
                  { $project: {price:1, name:1, commonToBoth:{ $size:{ $setIntersection: [ "$tags", product.tags ] }} } },
                  { "$sort": { "commonToBoth": -1  } },

                ]
             )

             const products = {products:prod}

            const categories = await  Cat.getCategoriesTree(req.query.category, shop);
            categories.tree = product.tree
            const orderStat= await orderStats(req.session.token, shop, req.params.id);
            const urlBase =`${shop}/view`;
            res.render('product', { title: 'product', products:products, url_base:urlBase, tree:tree, product: product, categories: categories, shopname: shop, orderStat:orderStat, username: userName});
        } 
    catch (e) {
        const obj={} 
        res.render('product', { title: 'product', products: [] ,tree:[],categories:[],shopname: req.params.shop, username: userName});   
     }
 
})

router.delete('/products/:id', admin, multer().none(), async (req, res) => {
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
    const newimages = req.files.map(x => x.filename)
    const images = JSON.parse( req.body.images)
    const product = await Product.findById(req.body.id)
    allowedUpdates.forEach((update) => product[update] = req.body[update])
    var cat = await Cat.findById(req.body.category)
    product.category= cat.name
    product.tree = cat.tree  
    var old_images = product.images.slice();
    product.images = images.concat(newimages) ;



    product.imgattributes = JSON.parse(req.body.imgattributes)
    product.attributes = JSON.parse(req.body.attributes)
    product.details = JSON.parse(req.body.details)
    product.tags = JSON.parse(req.body.tags)
   
    try
    {
 
        newimages.forEach(function (image){
            
 
            // cloudinary.upload(image);
            // product.images_url.push( cloudinary.url(image));
    
        })
        const removed = old_images.filter(element => !product.images.includes(element));
    
        removed.forEach(function (image){
    
            const index = product.images_url.indexOf(cloudinary.url(image));
            if (index > -1) {
                product.images_url.splice(index, 1);
                product.images.splice(index, 1);
            }
            try
            {
                var filePath = 'public/uploads/'+ product.images[i]; 
                const fs = require('fs');

                fs.unlink(filePath, (err) => {
                    if (!err) 
                    console.log('successfully deleted');
                  });
            }
            catch(e){
                
            }      
          //  cloudinary.destroy(image);
        })
        if((!req.body.mainimage || req.body.mainimage == "")&& product.images_url.length >0)
            product.mainimage = product.images_url[0]
        await product.save();
        res.redirect(req.body.currentUrl);
    }
    catch (e) {
         res.status(400).send({err:"message"})
    }
})
 
module.exports = router

 