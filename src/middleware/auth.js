const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        console.log('----suth-----------', req.session.token)
        
        res.status(401).send({ error: req.session.token})
    }
}

module.exports = auth