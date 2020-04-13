var express = require('express');
const Product = require('../models/product')
const router = new express.Router()
var multer = require('multer'); // v1.0.5

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
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
}).array('myFiles', 12)


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

router.post('/api/upload',  function(req,res){
    var tmp=[]
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        req.files.forEach(function(file) {
            tmp.push(file.filename);
        });

        res.end("File is uploaded"); 
 
        const product = new Product(req.body)
        product.images = tmp
        saveProduct(product, res)
    });
});

async function saveProduct(product, res){

    try {
        await product.save()
        // res.status(201).send({ product })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

module.exports = router




// const express = require('express')
// const multer = require('multer')
// const Product = require('../models/product')
// const auth = require('../middleware/auth')
// const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
// const router = new express.Router()
 
 
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
  
// const upload = multer({
//     storage: storage ,
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image'))
//         }

//         cb(undefined, true)
//     }
// })
// router.post('/api/upload',function(req,res){
//     console.log('req.-------------------------------------');
//     upload(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         res.end("File is uploaded"); 
//         console.log(req.body);
//     });
// });
//router.use(upload.array())

//router.use(restify.plugins.bodyParser());


// router.post('/products', async (req, res) => {
//     const product = new Product(req.body)
//     try {
//         await product.save()
//         res.status(201).send({ product })
//     } catch (e) {
//         console.log(e)
//         res.status(400).send(e)
//     }
// })
 
// router.patch('/products', async (req, res) => {
//     console.log(req.body.id)
//     const product = await Product.findById(req.body.id)

//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'description', 'price']
//     //const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     // if (!isValidOperation) {

//     //     console.log('asa9999999999999ssa'+isValidOperation)

//     //     return res.status(400).send({ error: 'Invalid updates!' })
//     // }
//     console.log(updates+ '---------------dddddddddddddddddddddd--------------------')

//     try {
//         allowedUpdates.forEach((update) => product[update] = req.body[update])
//         await product.save()
//         console.log('------------eeeeeeeeeee-----------------------')

//         res.send(product)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.post('/api/upload',function(req,res){
//     console.log('req.body9999999999999999999');
//     upload(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         res.end("File is uploaded"); 
//         console.log(req.body);
//     });
// });

// router.get('/products/me', auth, async (req, res) => {
//     res.send(req.product)
// })

// router.patch('/products/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.product[update] = req.body[update])
//         await req.product.save()
//         res.send(req.product)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/products/me', auth, async (req, res) => {
//     try {
//         await req.product.remove()
//         sendCancelationEmail(req.product.email, req.product.name)
//         res.send(req.product)
//     } catch (e) {
//         res.status(500).send()
//     }
// })



// router.post('/uploadmultiple',upload.array('myFiles', 12),async (req, res, next) => {
//     //console.log('---------------------------'+req.body)

//     const files = req.files
//     if (!files) {
//       const error = new Error('Please choose files')
//       error.httpStatusCode = 400
//       return next(error)
//     }
   
//       await res.send(files)
//      await  res.end("File is uploaded");
//             console.log('---------------------------here')
// console.log('---------------------------'+req.body)

//   })
   

//   router.post('/uploadfiles', upload.array(), async (req, res) => {

//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.product.avatar = buffer
//     await req.product.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })



//   router.post('/products/avatar', upload.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.product.avatar = buffer
//     await req.product.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// router.post('/products/me/avatar', auth, upload.single('avatar'), async (req, res) => {
//     console.log()
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.product.avatar = buffer
//     await req.product.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// router.delete('/products/me/avatar', auth, async (req, res) => {
//     req.product.avatar = undefined
//     await req.product.save()
//     res.send()
// })

// router.get('/products/:id/avatar', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id)

//         if (!product || !product.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(product.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })

module.exports = router