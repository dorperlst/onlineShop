const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Order = require('../models/order').Order

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    last: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    image: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
   
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }] 
}, {
    timestamps: true
})
 
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
 
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByToken = async (token) => {
  return await getUserByToken(token)
}

userSchema.statics.orderStats = async (token, shop) => {
    if(!token)
        return {total:0, totalItems:0}
    try
    {
        const user = await getUserByToken(token);
        const orderStats = await Order.orderStats(user._id, shop )
        return orderStats
    }
    catch(e){
       console.log(e);
    }
    
}

async function getUserByToken(token){
    if(!token)
        return null;

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }   )
    if (!user) 
        return null;
    return user
}
        
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return null;
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
   
    if (user.isModified('password')) {
       
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User