const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Shop = require('../models/shop')

async function getUser(req, res){
  
    try {    

        // console.log(req.session.token);

        req.user = req.session.token? await User.findByToken(req.session.token) : null
        if (!req.user)  
            res.redirect('/login');
    } catch (e) {
        res.send(e);
    }
}
 
async function getShop(req, res){
    await getUser(req, res)
    try {    
        req.shop = req.user ? await Shop.findOne({ admin : req.user._id }) :null
    } catch (e) {
        res.send(e);
        // req.shop = null
    }

}

const auth = async (req, res, next) => {
    await getUser(req, res)
    if (!req.user)  
        res.redirect('/login');
    next()
}

const admin = async (req, res, next) => {
    
    await getShop(req, res);
    if (!req.user  )  
    res.redirect('/login');
    if (!req.user || !req.shop )  
        res.redirect('/signup');
    else
        next()
    
}

module.exports = {auth, admin}