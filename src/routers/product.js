var express = require('express');
const Product = require('../models/product')
const Order = require('../models/order').Order
const Attribute = require('../models/attribute')
const Cat = require('../models/cat')
const User = require('../models/user')
const router = new express.Router()
var multer = require('multer'); 
const admin = require('../middleware/auth').admin
const limit = 15
const promtionLimit = 5

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


router.get('/admin', admin, async (req, res) => {
    var userName = req.session.name  
    if (userName == undefined)
        window.location.href="/login"
    var tree = [req.shop.name]
    try {
        const products = await Product.find({shop: req.shop.name }).sort({ "parent": -1 })
        const categories ={}
        categories.categories = await  Cat.find(({ tree: { $in: [req.shop.name] }} )) 
        categories.tree=[]
        res.render('admin', { title: 'admin', products: products, categories: categories, shopname: req.shop.name,tree:tree, username: userName});
        } 
    catch (e) {
        
        res.render('admin', { title: 'admin', products: [] ,shopname: req.shop.name, username: userName});   
     }
})

router.get('/add', admin, async (req, res) => {
    var userName = req.session.name  
    if (userName == undefined)
        window.location.href="/login"
    var tree = [req.shop.name]
    try {
        const products = await Product.find({shop: req.shop.name }).sort({ "parent": -1 })
        const categories = await  Cat.find() 

        res.render('add', { title: 'admin', products: products, categories: categories, shopname: req.shop.name,tree:tree, username: userName});
        } 
    catch (e) {
        
        res.render('add', { title: 'admin', products: [] ,shopname: req.shop.name, username: userName});   
     }
})

router.get('/:shop/view',async (req, res) => {
    
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    try {
            var params = [ {shop: req.params.shop }]
            const categories = await getCategories(req)
            if (categories.cur!=undefined) 
            {
                  var catname= req.query.category
                  
                  var cats=  await Cat.find( { tree: { $all: catname } },{_id:0,name:1}).select({_id:0,name:1}); //,
                  var prodCat=[]
                  cats.forEach((cat) => prodCat.push(cat.name))
                  params.push( { category: { $in: prodCat } } )
            }

                  
            const products = await getProducts(req, params)
            
            const orderStat= orderStats(req,res)
         
            res.render('products', { title: 'products', products: products, categories: categories, shopname: req.params.shop, 
                username: userName, orderStat: orderStat});
        } 
    catch (e) {
         res.render('products', { title: 'products', products: [] , categories: [],shopname: req.params.shop, username: userName});   
     }
})
 

// GET /products?completed=true
// GET /products?limit=10&skip=20
// GET /products?sortBy=createdAt:desc
// GET /products/yyyy?attributes=[["dsdsds","fsffssf"],["gggg","tttttt1"]]
router.get('/:shop/products', async (req, res) => {
  
    try {
        var name=req.query.category
         var params = [ {shop: req.params.shop }]
        if (req.query.category &&  req.query.category != 'All') 
        {
            // var catname= req.query.category
            // var cats=  await Cat.find( { tree: { $all: catname } },{_id:0,name:1}).select({_id:0,name:1}); //,
            // var prodCat=[]
            // cats.forEach((cat) => prodCat.push(cat.name))
            // params.push( { category: { $in: prodCat } } )
           
            params.push( {  tree: { $in: [catname] } } )

        }
        else
        {
            var tree = [req.params.shop];
         //   params.push( { category: { $in: tree } } )

        }
        
        const products = await getProducts(req, params)
        res.send({ products })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
 
async function getProducts(req, params)
{
    var sort = { "timestamps": -1 }
    const pageNum =  req.query.pageNum? parseInt(req.query.pageNum) : 0
    const skip = pageNum * limit  
 

    if (req.query.name)  
        params.push(  { name: req.query.name  } )
    if (req.query.pricefrom)  
        params.push(  { price:{"$gte": req.query.pricefrom}  } )
    if (req.query.priceto)  
        params.push(  { price:{"$lte": req.query.priceto}  } )
    if (req.query.tag)  
            params.push( {  "tags":req.query.tag } )
    
    if (req.query.attributes)  
    { 
        var att = JSON.parse(req.query.attributes)
        for(i=0; i <att.length; i++)
            params.push( {  "attributes.name":att[i][0], "attributes.value": att[i][1] } )
    }
  
    const match = { $and: params } 
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const products =  await Product.find(match).sort(sort).limit( parseInt(limit) ).skip( skip )
    const totalRows = await  Product.find(match).count();
    
    const promotionParams=[ {shop: req.params.shop },{  "promotion":true }] 
    const promotionMatch = { $and: promotionParams } 
    const promotion =  await Product.find(promotionMatch).sort(sort).limit( promtionLimit)
    var pager =  parseInt(totalRows / limit);
    if(totalRows % limit >0)
        pager +=1; 

    return {products, totalRows, pager, promotion}
}

async function getCategories(req){
    var shopName = req.params.shop
     var categories = {}
    if (req.query.category &&  req.query.category != 'All') 
    {
        var name=req.query.category
        const subCats = await Cat.find( {parent: name } )

        const selectedcat = await Cat.findOne({name:name, tree: { $in: [shopName] } })
        categories.tree = selectedcat.tree
        categories.cur = selectedcat.name
        categories.subCats = subCats
     }
    else
       categories.tree = [req.params.shop];
   
    const cats = await Cat.find({parent:null, tree: { $in: [shopName] }} )


 
    categories.categories = cats;

 
    return categories;
}


async function orderStats(req,res)
{
    if(userName =='Guest')
        return null

    const jwt = require('jsonwebtoken')
    const token = req.session.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    var params = [ {shop: req.params.shop }]
    params.push(  { owner: user._id  } )

    params.push(  { completed: false  } )
    const match = { $and: params } 

    var stat = await Order.aggregate([
        { $match : match } ,
        { "$unwind": "$products" }, 
        { "$project": { 
            "number": 1,  
            "value": { "$multiply": [
                { "$ifNull": [ "$products.count", 0 ] }, 
                { "$ifNull": [ "$products.price", 0 ] } 
            ]},
            "items": { $sum: "$products.count" }
        }}, 
        { "$group": { 
            "_id": "$number", 
            "total": { "$sum": "$value" } ,
            "totalItems": { "$sum": "$items" }

        }}
    ])
   return stat[0]
}



router.get('/:shop/view/:id', async (req, res) => {
    var userName = req.session.name != undefined ? req.session.name : 'Guest'
    var tree=[]
    try {
            const product = await Product.findById(req.params.id)
            const curCateory  = await Cat.findOne({ name :product.category }) 
            tree = curCateory.tree
            var orderStat= null
            if(userName!='Guest')
                orderStat = await orderStats(req, res)
            const categories ={}
            categories.tree = tree
            const subCats = await Cat.find( {parent: product.category } )
            categories.subCats=subCats
            categories.categories= await Cat.findByParent(null) 
            res.render('product', { title: 'product',tree:tree, product: product, categories: categories, shopname: req.params.shop, orderStat:orderStat, username: userName});
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
        res.send(product)
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
    const cat = await Cat.findOne({ _id: req.body.category}) 
    product.category = cat.name
    product.tree = cat.tree
    try
    {
       // await attribute.save()
        await product.save()
        res.send(product)
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
 
    try
    {
        await product.save()
        res.send(product)
    }
    catch (e) {
         res.status(400).send(e)
    }
})
  
module.exports = router

 