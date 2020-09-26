const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Shop = require('../models/shop')

async function getUser(req){
  
    try {    

        // console.log(req.session.token);

        req.user = req.session.token? await User.findByToken(req.session.token) : null
        if (!req.user)  
            res.redirect('/');
    } catch (e) {
        res.send(e);
    }
}
 
async function getShop(req){
    await getUser(req)
    try {    
        req.shop = req.user ? await Shop.findOne({ admin : req.user._id }) :null
    } catch (e) {
        res.send(e);
        // req.shop = null
    }

}

const auth = async (req, res, next) => {
    await getUser(req)
    if (!req.user)  
        res.redirect('/');
    next()
}

const admin = async (req, res, next) => {
    
    await getShop(req);
    if (!req.user  )  
    res.redirect('/login');
    if (!req.user || !req.shop )  
        res.redirect('/signup');
    else
        next()
    
}

module.exports = {auth, admin}