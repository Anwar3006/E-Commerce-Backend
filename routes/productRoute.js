const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  wishList,
  rating,
  uploadImages,
} = require("../controllers/productCtrl");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");

//POST Routes
router.route("/create").post(authMiddleware, isAdmin, createProduct);

//GET Routes
router.route("/get-products/:id").get(getProduct);
router.route("/get-products").get(getAllProducts);

//DELETE Routes
router.route("/delete/:id").delete(authMiddleware, isAdmin, deleteProduct);

//PUT Routes
router.route("/update/:id").put(authMiddleware, isAdmin, updateProduct);
router.route("/wishlist").put(authMiddleware, wishList);
router.route("/rating").put(authMiddleware, rating);
router
  .route("/upload/:id")
  .put(
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
  );

module.exports = router;
