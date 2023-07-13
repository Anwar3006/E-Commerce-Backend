const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')


// Allow only Bearer type authentication
const authMiddleware = asyncHandler( async (req, res, next) => {
    let token;
    if (req && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try {
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET)
                const findUser = await User.findById(decode.id, { '__v': 0, 'password': 0})
                req.user = findUser;
                next();
            }
        } catch (error) {
            throw new Error('Not Authorized. Token Expired. Please login again')
        }
    } else {
        throw new Error('There is no token attached to header')
    }
})

//
const isAdmin = asyncHandler( async (req, res, next) => {
    const { email } = req.user;
    const findUser = await User.findOne({ email });
    if (findUser.role !== 'admin') {
        throw new Error('You are not an admin')
    } else {
        next();
    }
})


module.exports = {
    authMiddleware,
    isAdmin,
}