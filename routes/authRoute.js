const express = require("express");
const router = express.Router();
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
  updateOrderStatus,
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// POST routes
router.route("/register").post(createUser);
router.route("/login-user").post(loginUser);
router.route("/login-admin").post(loginAdmin);
router.route("/forgotpassword").post(forgotPasswordToken);
router.route("/cart/add-to-cart").post(authMiddleware, userCart);
router.route("/cart/apply-coupon").post(authMiddleware, applyCoupon);
router.route("/orders/create").post(authMiddleware, createOrder);

// GET routes
router.route("/get-users").get(getAllUsers);
router.route("/get-users/:id").get(authMiddleware, isAdmin, getUser);
router.route("/login/refresh").get(handleRefreshToken);
router.route("/logout").get(logout);
router.route("/wishlist").get(authMiddleware, getWishlist);
router.route("/cart/get").get(authMiddleware, getUserCart);
router.route("/orders/get").get(authMiddleware, getOrders);

// DELETE routes
router.route("/delete/:id").delete(deleteUser);
router.route("/cart/empty-cart").delete(authMiddleware, emptyCart);

// PUT routes
router.route("/update-users").put(authMiddleware, updateUser);
router.route("/block/:id").put(authMiddleware, isAdmin, blockUsers);
router.route("/unblock/:id").put(authMiddleware, isAdmin, UnblockUsers);
router.route("/updatepassword").put(authMiddleware, updatePassword);
router.route("/resetpassword/:token").put(resetPassword);
// router.route('/users/address').put(authMiddleware, saveAddress) #redundant(/users/edit can achieve this functionality)
router
  .route("/orders/update/:id")
  .put(authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
