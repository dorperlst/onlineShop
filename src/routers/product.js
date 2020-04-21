var express = require('express');
const Product = require('../models/product')
const router = new express.Router()
var multer = require('multer'); 
  
 
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
 
router.delete('/products/:id', async (req, res) => {
     
    try {
        console.log('-----'+req.params.id)
        const product = await Product.findById(req.params.id)
        await product.remove()
      //  console.log('-----'+product)
        res.send(product)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})



router.post('/products', upload.array('myFiles', 12),async  function (req, res, next) {
    const product = new Product(req.body)
    console.log(req.body)
    product.images = req.files.map(x => x.filename)
    try
    {
        await product.save()
        res.send(product)
    }
    catch (e) {
         res.status(400).send(e)
    }
})

router.patch('/products', upload.array('myFiles', 12), async function (req, res, next) {
    images= req.files.map(x => x.filename)

    const product = await Product.findById(req.body.id)
    if(images.length > 0)
        product.images = product.images.concat( images)

    const allowedUpdates = ['name', 'description', 'price']
    allowedUpdates.forEach((update) => product[update] = req.body[update])
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

 