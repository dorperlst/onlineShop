var express = require('express');
const Cat = require('../models/cat')
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
 
router.get('/cats/:id', async (req, res) => {
    const cat = await Cat.findById(req.params.id)
    try {
        res.send({ cat })
     } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/cats', admin, async (req, res) => {

    const cat = await Cat.find().sort({ "level": 1 })//{ tree: { "$in" : ["cat 0 1"]} }
    try {
        res.send({ cat })
     } catch (e) {
        res.status(400).send(e)
    }
})
 
router.delete('/cats/:id', async (req, res) => {
     
    try {
      //  console.log('-----'+req.params.id)
        const cat = await Cat.findById(req.params.id)
        await cat.remove()
      //  console.log('-----'+cat)
        res.send(cat)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/cats', admin, upload.single('avatar'), async function (req, res, next) {
    const cat = new Cat(req.body)
    if(!req.body.parent)
    {
        cat.tree = [req.shop.name, req.body.name]
    }
    else
    {
        var parent = await Cat.findById(req.body.parent) ;
        cat.tree = parent.tree.concat([req.body.name])
    }
    cat.level = cat.tree.length
    cat.owner = req.shop._id
    
    if(req.file != undefined)
        cat.image = req.file.filename
    try
    {
        await cat.save()
        res.send(cat)
    }
    catch (e) {
        console.log(e)
         res.status(400).send(e)
    }
})

router.patch('/cats', admin, upload.array('myFiles', 12), async function (req, res, next) {
    images= req.files.map(x => x.filename)

    const cat = await Cat.findById(req.body.id)
    if(images.length > 0)
        cat.images = cat.images.concat( images)

    const allowedUpdates = ['name', 'description', 'price']
    allowedUpdates.forEach((update) => cat[update] = req.body[update])
    try
    {
        await cat.save()
        res.send(cat)
    }
    catch (e) {
         res.status(400).send(e)
    }
})
  

 


module.exports = router

 