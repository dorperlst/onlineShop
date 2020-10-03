var express = require('express');
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order').Order
const Cat = require('../models/cat')
const router = new express.Router()
const ejs = require('ejs'); 
const admin = require('../middleware/auth').admin;
const multer = require('../multer/multer')
// const path = require('path');
const cloudinary = require('../cloudinary/cloudinary')

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
        var cloudinary2 = require('cloudinary').v2;


 
var con =cloudinary2.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
    });



        res.send({ con})
    } catch (e) {
        
        res.send(e)
    }
})
router.get('/:shop/products22', async (req, res) => {
    try {
        var cloudinary2= require('cloudinary').v2;

        const products = await Product.find();
        var cloudinary2 = require('cloudinary').v2;
         
        cloudinary2.config({ 
            cloud_name: process.env.CLOUDINARY_NAME, 
            api_key:process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
            });
            cloudinary2.uploader.upload(
                "public/images/shop.png" , 
                {public_id: "shodddp"}, 
                function(error, result) { 
                   return error 
                }
                );        

 
 
    //cloudinary.upload("../../images/shop.png");


        res.send({ products})
    } catch (e) {
       
        res.send(e)
    }
})

router.get('/:shop/products2', async (req, res) => {
    try {

        const products = await Product.find();


        

 
    cloudinary.upload("shop.png");


        res.send({ products})
    } catch (e) {
        console.log(e)
        res.send(e)
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

router.delete('/products/:id', admin, multer.multer().none(), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(product)
            await product.remove()
        res.redirect(req.body.currentUrl);
    } catch (e) {
        console.log(e)
        res.status(500).send() 
    }
})

router.post('/products', admin,  multer.upload.array('myFiles', 12) , async  function (req, res, next) {
     const product = new Product({
        ...req.body,
        shop: req.shop.name,
        attributes: JSON.parse(req.body.attributes),
        imgattributes: JSON.parse(req.body.imgattributes),
        tags: JSON.parse(req.body.tags),
        details: JSON.parse(req.body.details)
        
    })
    var images = req.files.map(x => x.filename)
    product.images= images;
    product.images_url=   [];

    product.images.forEach(function (image){
        product.images_url.push( cloudinary.url(image));
        cloudinary.upload(image);
    })

    if((!req.body.mainimage || req.body.mainimage == "") && product.images_url.length >0)
        product.mainimage = product.images_url[0]
 
        
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

router.patch('/products',admin,  multer.upload.array('myFiles', 12), async function (req, res, next) {
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


     
    newimages.forEach(function (image){
       cloudinary.upload(image);
       product.images_url.push( cloudinary.url(image));

    })
    const removed = old_images.filter(element => !product.images.includes(element));

    removed.forEach(function (image){

        const index = product.images_url.indexOf(cloudinary.url(image));
        if (index > -1) {
            product.images_url.splice(index, 1);
            product.images.splice(index, 1);
        }

        cloudinary.destroy(image);
    })

    product.imgattributes = JSON.parse(req.body.imgattributes)
    product.attributes = JSON.parse(req.body.attributes)
    product.details = JSON.parse(req.body.details)
    product.tags = JSON.parse(req.body.tags)
    if((!req.body.mainimage || req.body.mainimage == "")&& product.images_url.length >0)
        product.mainimage=product.images_url[0]
    try
    {
        product.save();
        res.redirect(req.body.currentUrl);    }
    catch (e) {
         res.send(e)
    }
})
  
module.exports = router

 