var express = require('express');
const Product = require('../models/product')
const Attribute = require('../models/attribute')

const Cat = require('../models/cat')
const Shop = require('../models/shop')
const router = new express.Router()
var multer = require('multer'); 
const authObj = require('../middleware/auth')
const admin = authObj.admin

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
 
router.get('/product/:shop/:id', async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id}) 
    try {
        res.send({ product })
     } catch (e) {
        res.status(400).send(e)
    }
})

 

// GET /products?completed=true
// GET /products?limit=10&skip=20
// GET /products?sortBy=createdAt:desc
// GET /products/yyyy?attributes=[["dsdsds","fsffssf"],["gggg","tttttt1"]]
router.get('/products/:shop', async (req, res) => {
   
    var params = [ {tree: { "$in" : [req.params.shop]} }]
    var sort = { "price": -1 }
    var limit = !req.query.limit ? 5 : req.query.limit
    var skip = !req.query.skip ? 0 : req.query.skip
 
    if (req.query.category)  
        params.push( { tree: { "$in" : [req.query.category]} } )
    
    if (req.query.name)  
        params.push(  { name: req.query.name  } )

    if (req.query.attributes)  
    { 
       var att = JSON.parse(req.query.attributes)
       for(i=0;i<att.length;i++)
             params.push( {  "attributes.name":att[i][0], "attributes.description": att[i][1] } )
    }
         
    const match = { $and: params } 
 
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const products =await Product.find(match).sort(sort).limit( parseInt(limit) ).skip(parseInt(skip))//await Product.find( { "attributes.name": "dsdsds", "attributes.description": "fsffssf" }) //
        res.send({ products })
    } catch (e) {
        res.status(500).send(e)
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
    const cat = await Cat.findOne({ _id: req.body.category}) 
    attribute = new Attribute({ attributes: JSON.parse(req.body.attributes),
    })
    const product = new Product({
        ...req.body,
        owner: req.shop._id,
        attributes: JSON.parse(req.body.attributes),
        tree: cat.tree.concat([req.body.name]),
        images : req.files.map(x => x.filename)
    })
    try
    {
        await attribute.save()

        await product.save()
        res.send(product)
    }
    catch (e) {
        console.log (e)
        res.status(400).send(e)
    }
})

router.patch('/products',admin, upload.array('myFiles', 12), async function (req, res, next) {
    const allowedUpdates = ['name', 'description', 'price']

    images= req.files.map(x => x.filename)

    const product = await Product.findById(req.body.id)
    if(images.length > 0)
        product.images = product.images.concat( images)

    allowedUpdates.forEach((update) => product[update] = req.body[update])
    if( product.category != req.body.category)
    {
        const cat = await Cat.findOne({ _id: req.body.category}) 
        product.tree = cat.tree.concat([req.body.name])
        product.category = req.body.category
    }

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

 