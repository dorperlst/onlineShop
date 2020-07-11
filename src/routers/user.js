const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const Contact = require('../models/contact')

const authObj = require('../middleware/auth')
const auth = authObj.auth
const { sendWelcomeEmail, sendContactEmail, sendCancelationEmail } = require('../emails/account')
const { admin } = require('../middleware/auth')
const router = new express.Router()


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/users');
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


router.get('/users', async (req, res) => {
    const user = await User.find()
    res.send({ user })
    
})
 
router.post('/users/:shop/contact', multer().none(), async (req, res) => {
 
    

    try {
        const contact = new Contact (req.body)
        contact.shop = req.params.shop
        await contact.save()
        
        sendContactEmail(req.body.email, req.body.name,"Your msg is recived")
        res.send({ msg: "msessage as been send successfully" })
     } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/users/:shop/contact', multer().none(), async (req, res) => {
    try {
        const contact = await Contact.findById(req.body.id)
        contact.reply = req.body.reply
        await contact.save()
        sendContactEmail(contact.email, contact.name, contact.reply)
        res.send({ msg: "msessage as been send successfully" })
     } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.get('/contact',admin, async (req, res) => {

    const contact = await Contact.find({shop:req.shop.name})
    var userName = req.session.name != undefined ? req.session.name : 'Guest'

    const orderStat= orderStats(req,res)

    res.render('contact', {   title: 'contact',contact:contact,shopname: req.shop.name,   username: userName})
})



    
    


router.post('/users', upload.single('avatar'), async function (req, res, next) {
 //console.log(req.body)
    const user = new User(req.body)
    if(req.file!= undefined)
        user.image = req.file.filename

    try {
        await user.save()
     //   sendWelcomeEmail(user.email, user.name)
        redirectSession(req, res, user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})
 // todo confermation mail
router.post('/users/login', multer().none(), async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        
        redirectSession(req, res, user,req.body.currentUrl)
    } catch (e) {
        res.status(400).send('Unable to login')
    }
})

async function redirectSession(req, res, user, href){
    const token = await user.generateAuthToken()   
    var sess = req.session;
    sess.token = token
    sess.name = user.name

    var hour = 360000000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour
    res.redirect(href);
}

router.post('/users/logout', multer().none(),  auth, async (req, res) => {
  
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.session.token
    })
    logout(req, req.body.currentUrl, res)
        
            
     
})

async function logout(req, href, res){
    req.session.token=''
    req.session.username = ''

    req.session.cookie.expires = new Date(Date.now())
    req.session.cookie.maxAge = 0
    try{
        await req.user.save()
    res.redirect(href);

    }
    catch (e) {
        res.status(500).send()
    }
}




router.post('/users/logoutAll', multer().none(), auth, async (req, res) => {
   
    req.user.tokens = []
    logout(req, req.body.currentUrl, res)
     
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/:shop/account', auth,multer().none(), async (req, res) => {
    const updates = Object.keys(req.body)
 
    const allowedUpdates = ['name', 'last', 'email', 'phone','address']
    allowedUpdates.forEach((update) => req.user[update] = req.body[update])
    
    try {
        
        res.redirect("/"+req.params.shop+"/account")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

 

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router