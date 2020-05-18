const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const authObj = require('../middleware/auth')
const auth = authObj.auth
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
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
        redirectSession(req, res, user)
    } catch (e) {
        res.status(400).send('Unable to login')
    }
})

async function redirectSession(req, res, user){
    const token = await user.generateAuthToken()   
    var sess = req.session;
    sess.token = token
    sess.name = user.name

    var hour = 360000000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour
    res.redirect('/admin');
}

router.post('/users/logout', auth, async (req, res) => {
    try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.session.token
            })
           
            req.session.cookie.expires = new Date(Date.now())
            req.session.cookie.maxAge = 0
            await req.user.save()
            res.redirect('/yyyy/view');
     } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.session.token=''
        req.session.username = ''

        req.user.tokens = []
        await req.user.save()
        res.redirect('/yyyy/view');
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
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