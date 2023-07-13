const express = require('express')
const { createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory } = require('../controllers/blogCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

//POST Route
router.route('/categories-blog/create').post(authMiddleware, isAdmin, createCategory)

//PUT Route
router.route('/categories-blog/update/:id').put(authMiddleware, isAdmin, updateCategory)

//DELETE Route
router.route('/categories-blog/delete/:id').delete(authMiddleware, isAdmin, deleteCategory)

//GET Route
router.route('/categories-blog/get/:id').get(getCategory)
router.route('/categories-blog/get').get(getAllCategory)

module.exports = router