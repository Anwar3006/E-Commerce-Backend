const express = require('express')
const router = express.Router()
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware')
const {
    createProduct,
    getProduct, 
    getAllProducts,
    updateProduct,
    deleteProduct,
    wishList,
    rating,
    uploadImages,
    } = require('../controllers/productCtrl')
const { uploadPhoto, productImgResize } = require('../middleware/uploadImages')


//POST Routes
router.route('/products/create').post(authMiddleware, isAdmin, createProduct)


//GET Routes
router.route('/products/:id').get(getProduct)
router.route('/products').get(getAllProducts)


//DELETE Routes
router.route('/products/delete/:id').delete(authMiddleware, isAdmin, deleteProduct)


//PUT Routes
router.route('/products/update/:id').put(authMiddleware, isAdmin, updateProduct)
router.route('/products/wishlist').put(authMiddleware, wishList)
router.route('/products/rating').put(authMiddleware, rating)
router.route('/products/upload/:id').put(
    authMiddleware, isAdmin, uploadPhoto.array('images', 10),
    productImgResize,
    uploadImages
)


module.exports = router