var express = require('express');
const Cat = require('../models/cat')
const Product = require('../models/product')

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
 
router.get('/:shop/cats/:id', async (req, res) => {
    const cat = await Cat.findById(req.params.id)
    try {
        res.send({ cat })
     } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/:shop/cats', async (req, res) => {
  
    var params = [ {tree: req.params.shop }]
    var sort = {  }
    var limit = !req.query.limit ? 50 : req.query.limit
    var skip = !req.query.skip ? 0 : req.query.skip
 
    if (req.query.category)  
        params.push( { tree: req.query.category } )

    if (req.query.parent)  
        params.push( { parent: req.query.parent } )
   
    if (req.query.name)  
        params.push(  { name: req.query.name  } )
         
    const  match= { $and: params } 
 
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const cats = await Cat.find(match).sort(sort).limit( parseInt(limit) ).skip(parseInt(skip))
        res.send({ cats })
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
    cat.owner = req.shop._id
  
    if(req.body.category ==='0')
        cat.tree = [req.shop.name, cat.name]
    else
    {
        var parent = await Cat.findById(req.body.category) ;
        cat.tree = parent.tree.concat([cat.name])
        cat.parent = parent.name
    }
   
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
    images = req.files.map(x => x.filename)

    const cat = await Cat.findById(req.body.id)
    if(images.length > 0)
        cat.image =  images[0]

    const allowedUpdates = [ 'description']
    allowedUpdates.forEach((update) => cat[update] = req.body[update])
    var parent = !req.body.category ? undefined : await Cat.findById(req.body.category)
    var catName = req.body.name

    if(cat.name != catName)
    {
        var nestedCategories = await Cat.find( { tree: { $all: catname } } )

        nestedCategories.forEach(function (nestedcat){
            var foundIndex = nestedcat.tree.findIndex((x=> x == catname))
            nestedcat.tree[foundIndex] = catName
            if(nestedcat.parent === cat.name)
                nestedcat.parent = catName
            nestedcat.save()
        })
        
    }
    if(cat.parent != parent.name)
    { 
        var parentree= []

        if(parent.name)
        {
            parentree = curParrent.tree
        }
        else
        {
            var shop = cat.tree[0]
            parentree.push (shop)
        }
       
        var  catname = cat.name
        var nestedCategories = await Cat.find( { tree: { $all: catname } } )
       
        nestedCategories. forEach(function (nestedcat){
            var foundIndex = nestedcat.tree.findIndex((x=> x == catname))
            var catTree= nestedcat.tree.slice(foundIndex,nestedcat.tree.length)
            nestedcat.tree = parentree.concat( catTree)
            nestedcat.save()
     
        })
        cat.parent = parent.name
    }

      

    //    for(i =0;i<nestedCategories;i++)
    //    {
          
    //         var foundIndex = nestedCategories[i].tree.foundIndex((x=> x.parent == cat.name))
    //         console.log('foundIndex----'+ foundIndex)
    //         nestedCategories[i].tree =parent.tree.concat( nestedCategories[i].tree.slice(foundIndex))
    //          nestedCategories[i].save()
    //         console.log(nestedCategories[i].tree)

    //    }
    // }



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

 