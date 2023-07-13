const express = require('express')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const { createCoupon,
    updateCoupon, 
    getAllCoupons,
    deleteCoupon,
    getCoupon} = require('../controllers/couponCtrl')
const router = express.Router()

//POST Route
router.route('/coupons/create').post(authMiddleware, isAdmin, createCoupon)

//PUT Route
router.route('/coupons/update/:id').put(authMiddleware, isAdmin, updateCoupon)

//DELETE Route
router.route('/coupons/delete/:id').delete(authMiddleware, isAdmin, deleteCoupon)

//GET Route
router.route('/coupons').get(authMiddleware, isAdmin, getAllCoupons)
router.route('/coupons/:id').get(authMiddleware, isAdmin, getCoupon)

module.exports = router