const express = require('express');
const Cat = require('../models/cat')
const Product = require('../models/product')
const router = new express.Router()
const multer = require('../multer/multer')
const authObj = require('../middleware/auth')
const admin = authObj.admin
   
router.get('/:shop/cats/:id', async (req, res) => {
    const cat = await Cat.findById(req.params.id)
    try {
        res.send({ cat })
     } catch (e) {
        res.status(400).send(e)
    }
})
 
router.delete('/cats/:id',admin, async (req, res) => {
     
    try {
        const cat = await Cat.findById(req.params.id)
        var catName = cat.name
        if(!cat.parent)
            res.status(403).send("Can not Remove Main Category")

        var nestedCategories = await Cat.find( { tree: { $all: catName } } )
        nestedCategories.forEach(function (nestedcat){
            var foundIndex = nestedcat.tree.findIndex((x=> x == catName))
            nestedcat.tree.splice(foundIndex, 1);
            nestedcat.markModified("tree");
            if(nestedcat.parent === cat.name)
                nestedcat.parent = cat.parent
            nestedcat.save()
        })

        var products = await Product.find({category:catName})
        products.forEach(function (product){
            product.category = cat.parent
            product.save()
        })
        await cat.remove()
        res.redirect(req.body.currentUrl);
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/cats', admin, multer.upload.single('avatar'), async function (req, res, next) {
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
        res.redirect(req.body.currentUrl);    
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/cats', admin, multer.upload.array('myFiles', 12), async function (req, res, next) {
    images = req.files.map(x => x.filename)

    const cat = await Cat.findById(req.body.id)
    if(images.length > 0)
        cat.image =  images[0]

    const allowedUpdates = [ 'description']
    allowedUpdates.forEach((update) => cat[update] = req.body[update])
    var parent = req.body.category=="0" ? undefined : await Cat.findById(req.body.category)
    var newName = req.body.name
    var  catname = cat.name
    var nestedCategories = await Cat.find( { tree: { $in: catname } } )
    if(cat.name != newName)
    {
        nestedCategories.forEach( async function (nestedcat){
            var foundIndex = nestedcat.tree.findIndex((x=> x == catname))
            nestedcat.tree[foundIndex] = newName
            if(nestedcat.parent === catname)
                nestedcat.parent = newName
            nestedcat.markModified("tree");
            nestedcat.save()
        })
       cat[ cat.tree.indexOf(cat.name) ] = newName
       cat.name = newName
 
    }
    if(parent && cat.parent != parent.name)
    { 
        var parentree= []

        if(parent.name)
        {
            parentree = parent.tree
        }
        else
        {
            var shop = cat.tree[0]
            parentree.push (shop)
        }
       
        var nestedCategories = await Cat.find( { tree: { $all: catname } } )
       
        nestedCategories. forEach(function (nestedcat){
            var foundIndex = nestedcat.tree.findIndex((x=> x == catname))
            var catTree= nestedcat.tree.slice(foundIndex,nestedcat.tree.length)
            nestedcat.tree = parentree.concat( catTree)
            nestedcat.markModified("tree");
            nestedcat.save()
     
        })
        cat.parent = parent.name
    }
    var products= await Product.find({category:catname})
    products.forEach(function (product){

        product.category= newName
        product.tree = cat.tree
        product.save()
    })

    try
    {
        await cat.save()
        res.redirect('/admin');    
    }
    catch (e) {
         res.status(400).send(e)
    }
})
  
 
module.exports = router

 