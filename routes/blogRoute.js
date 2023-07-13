const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controllers/blogCtrl");
const { uploadPhoto, blogImgResize } = require("../middleware/uploadImages");
const router = express.Router();

//POST Route
router.route("/create").post(authMiddleware, isAdmin, createBlog);

//PUT Route
router.route("/update/:id").put(authMiddleware, isAdmin, updateBlog);
router.route("/likes").put(authMiddleware, likeBlog);
router.route("/dislikes").put(authMiddleware, dislikeBlog);
router
  .route("/upload/:id")
  .put(
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    blogImgResize,
    uploadImages
  );

//GET Route
router.route("/get-blogs/:id").get(getBlog);
router.route("/get-blogs").get(getAllBlogs);

//DELETE Route
router.route("/delete/:id").delete(authMiddleware, isAdmin, deleteBlog);

module.exports = router;
