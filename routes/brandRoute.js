const express = require('express')
const router = express.Router()
const { createBrand,
    updateBrand, 
    deleteBrand,
    getBrand,
    getAllBrands} = require('../controllers/brandCtrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')


//POST Route
router.route('/brands/create').post(authMiddleware, isAdmin, createBrand)

//PUT Route
router.route('/brands/update/:id').put(authMiddleware, isAdmin, updateBrand)

//DELETE Route
router.route('/brands/delete/:id').delete(authMiddleware, isAdmin, deleteBrand)

//GET Route
router.route('/brands/get/:id').get(getBrand)
router.route('/brands/get').get(getAllBrands)

module.exports = router