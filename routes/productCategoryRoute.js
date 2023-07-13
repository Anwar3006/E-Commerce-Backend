const express = require('express')
const { createCategory,
    deleteCategory, 
    updateCategory, 
    getCategory, 
    getAllCategory} = require('../controllers/productCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

//POST Route
router.route('/categories-product/create').post(authMiddleware, isAdmin, createCategory)

//PUT Route
router.route('/categories-product/update/:id').put(authMiddleware, isAdmin, updateCategory)

//DELETE Route
router.route('/categories-product/delete/:id').delete(authMiddleware, isAdmin, deleteCategory)

//GET Route
router.route('/categories-product/:id').get(getCategory)
router.route('/categories-product').get(getAllCategory)

module.exports = router