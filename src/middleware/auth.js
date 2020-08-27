const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Shop = require('../models/shop')


const auth = async (req, res, next) => {
    try {
        var redirect_url = `/${req.params.shop}/view` ;
        
        if (!req.session.token) {
            res.redirect(redirect_url);
        }
        else
        {
            const token = req.session.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    
            if (!user)  
                res.redirect(redirect_url);
            else
                req.user = user

            
        }
       

 
        next()
    } catch (e) {
        console.log('----usersuth-----------', req.session.token)
        res.status(401).send({ error: req.session.token})
    }
}

const admin = async (req, res, next) => {
    
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user)  
            res.redirect('/login');
 
        req.user = user
        const shop = await Shop.findOne({ admin : user._id })
        if (!shop)  
            res.redirect('/login');
        req.shop = shop
        next()
    } catch (e) {
        res.redirect('/login');

    }
}

module.exports = {auth, admin}