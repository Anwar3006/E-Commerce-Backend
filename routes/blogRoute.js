const express = require('express')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const { createBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages} = require('../controllers/blogCtrl')
const { uploadPhoto, blogImgResize } = require('../middleware/uploadImages')
const router = express.Router()

//POST Route
router.route('/blogs/create').post(authMiddleware, isAdmin, createBlog)

//PUT Route
router.route('/blogs/update/:id').put(authMiddleware, isAdmin, updateBlog)
router.route('/blogs/likes').put(authMiddleware, likeBlog)
router.route('/blogs/dislikes').put(authMiddleware, dislikeBlog)
router.route('/blogs/upload/:id').put(authMiddleware, 
    isAdmin, uploadPhoto.array('images', 10), blogImgResize, uploadImages)

//GET Route
router.route('/blogs/:id').get(getBlog)
router.route('/blogs').get(getAllBlogs)

//DELETE Route
router.route('/blogs/:id').delete(authMiddleware, isAdmin, deleteBlog)

module.exports = router