const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const { validateID } = require('../utils/validateID')

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCoupon = await Coupon.findByIdAndUpdate(id,
            req.body,
            { new:true }
        )
        res.json(findCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCoupon = await Coupon.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            msg: `Coupon with id: ${findCoupon.id} and name: ${findCoupon.name} has been successfully deleted`
        }); 
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const findCoupon = await Coupon.find()
        res.json(findCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCoupon = await Coupon.findById(id)
        res.json(findCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons,
    getCoupon 
}
