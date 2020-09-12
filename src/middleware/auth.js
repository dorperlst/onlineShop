const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Shop = require('../models/shop')

async function getUser(req){
  
    try {    
        req.user = req.session.token? await User.findByToken(req.session.token) : null
    } catch (e) {
        req.user = null
    }
}
 
async function getShop(req){
    await getUser(req)
    try {    
        req.shop = req.user ? await Shop.findOne({ admin : req.user._id }) :null
    } catch (e) {
        req.shop = null
    }

}

const auth = async (req, res, next) => {
    await getUser(req)
    if (!req.user)  
        res.redirect('/login');
    next()
}

const admin = async (req, res, next) => {
    
    await getShop(req);
    if (!req.user || !req.shop )  
        res.redirect('/login');
    else
        next()
    
}

module.exports = {auth, admin}