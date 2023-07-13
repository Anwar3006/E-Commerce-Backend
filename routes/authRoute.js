const express = require('express')
const router = express.Router()
const {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser, 
    updateUser,
    blockUsers,
    UnblockUsers,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus} = require('../controllers/userCtrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')

// POST routes
router.route('/users/register').post(createUser)
router.route('/users/login-user').post(loginUser)
router.route('/users/login-admin').post(loginAdmin)
router.route('/users/forgotpassword').post(forgotPasswordToken)
router.route('/users/cart/add-to-cart').post(authMiddleware, userCart)
router.route('/users/cart/apply-coupon').post(authMiddleware, applyCoupon)
router.route('/users/orders/create').post(authMiddleware, createOrder)

// GET routes
router.route('/users/get-users').get(getAllUsers)
router.route('/users/get-users/:id').get(authMiddleware, isAdmin, getUser)
router.route('/login/refresh').get(handleRefreshToken)
router.route('/logout').get(logout)
router.route('/user/wishlist').get(authMiddleware, getWishlist)
router.route('/users/cart/get').get(authMiddleware, getUserCart)
router.route('/users/orders/get').get(authMiddleware, getOrders)

// DELETE routes
router.route('/users/delete-users/:id').delete(deleteUser)
router.route('/users/cart/empty-cart').delete(authMiddleware, emptyCart)

// PUT routes
router.route('/users/update-users').put(authMiddleware, updateUser)
router.route('/users/block/:id').put(authMiddleware, isAdmin, blockUsers)
router.route('/users/unblock/:id').put(authMiddleware, isAdmin, UnblockUsers)
router.route('/users/updatepassword').put(authMiddleware, updatePassword)
router.route('/users/resetpassword/:token').put(resetPassword)
// router.route('/users/address').put(authMiddleware, saveAddress) #redundant(/users/edit can achieve this functionality)
router.route('/users/orders/update/:id').put(authMiddleware, isAdmin, updateOrderStatus)

module.exports = router