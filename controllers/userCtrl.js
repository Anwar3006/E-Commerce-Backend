const { generateToken } = require("../config/jwtoken");
const User = require("../models/userModel"); // Database model
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { validateID } = require("../utils/validateID");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("./emailCtrl");
const { v4: uuidv4 } = require("uuid");

// create a new user
const createUser = asyncHandler(async (req, res) => {
  //email from Usermodel is unique; use email to find user
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // create user
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    //user already exists
    throw new Error("User Already Exists");
  }
});

// login users
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email: email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json({
      id: findUser.id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findAdmin = await User.findOne({ email: email });
  if (findAdmin.role !== "admin") throw new Error("You are not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findAdmin.id);
    await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({
      id: findAdmin.id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      token: generateToken(findAdmin.id),
    });
  } else {
    throw new Error("Invalid username and password");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh token in Cookies");

  const findUser = await User.findOne({ refreshToken });
  if (!findUser) throw new Error("No user associated with Token");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, data) => {
    if (err || findUser.id !== data.id) {
      throw new Error("Invalid token");
    }
    const accessToken = generateToken(findUser.id);
    res.json({ accessToken });
  });
});

// Save user address
const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const address = req.body.address;
  validateID(id);
  try {
    const findUser = await User.findByIdAndUpdate(
      id,
      { address: address },
      { new: true }
    );
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const findUsers = await User.find({}, { __v: 0 });
    res.status(200).json(findUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await User.findById({ _id: id });
    res.status(200).json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateID(id);
  try {
    const findUser = await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      msg: `User with id: ${findUser.id} and username: ${findUser.email} has been successfully deleted`,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateID(id);
  try {
    const findUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Block users as Admin
const blockUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateID(id);
  try {
    const findUser = await User.findOneAndUpdate(
      { _id: id },
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock users as Admin
const UnblockUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateID(id);
  try {
    const findUser = await User.findOneAndUpdate(
      { _id: id },
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// User logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh token in Cookies");

  const findUser = await User.findOne({ refreshToken });
  // console.log(findUser);
  if (!findUser) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

//Update user password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateID(id);
  const findUser = await User.findById(id);

  const password = req.body.password;
  if (password) {
    findUser.password = password;
    // Generate and set the password reset token
    const updatedPassword = await findUser.save();
    res.json(updatedPassword);
  } else {
    res.json(findUser);
  }
});

//Generate token for user Forgot Password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) throw new Error("User with email not found");
  try {
    const token = await findUser.createPasswordResetToken();
    await findUser.save();
    const resetURL = `Hello please click the provided link to reset your password. This link is valid for only 10 minutes.\
         <a href="http://localhost:5050/api/v1/users/resetpassword/${token}"> Click Me </a>`;
    const data = {
      to: email,
      subject: "Password Reset Link",
      text: "Reset",
      htm: resetURL,
    };
    sendEmail(data);

    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//Function to reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const findUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!findUser)
    throw new Error(
      "Token expired. Please request for a new token and try again"
    );
  findUser.password = password;
  //after password reset; set the below to undefined. No longer needed
  findUser.passwordResetExpires = undefined;
  findUser.passwordResetToken = undefined;
  await findUser.save();
  res.json(findUser);
});

//Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//
const userCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { cart } = req.body;
  try {
    const findUser = await User.findById(id);
    //check if product already in user's cart
    const alreadyInCart = await Cart.findOne({ postedBy: findUser.id });
    let products = [];
    //if cart already has the item posted by the same user then remove the item to avoid duplicates
    if (alreadyInCart) {
      alreadyInCart.remove();
    }
    //cart = array of objects; of each object extract info; get price of product from Product model
    for (let i = 0; i < cart.length; i++) {
      let obj = {};
      obj.product = cart[i].id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      obj.price = getPrice.price;
      products.push(obj);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].count * products[i].price;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: findUser.id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//Get the cart of user
const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateID(id);
  try {
    const findUserCart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(findUserCart);
  } catch (error) {
    throw new Error(error);
  }
});

//Empty cart for a user
const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateID(id);
  try {
    const findUser = await User.findById(id);
    const findCart = await Cart.findOneAndRemove({ orderBy: findUser.id });
    res.json(findCart);
  } catch (error) {
    throw new Error(error);
  }
});

// Apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;
  validateID(id);
  try {
    const findCoupon = await Coupon.findOne({ name: coupon });
    if (findCoupon === null) throw new Error("Invalid Coupon");

    const findUser = await User.findById(id);
    let { cartTotal } = await Cart.findOne({ orderBy: findUser.id }).populate(
      "products.product"
    );

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * findCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderBy: findUser.id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

//Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  validateID(id);
  try {
    if (!COD) throw new Error("Create Cash order failed");
    const findUser = await User.findById(id);
    const findUserCart = await Cart.findOne({ orderBy: findUser.id });
    let finalAmount = 0;
    if (couponApplied && findUserCart.totalAfterDiscount) {
      finalAmount = findUserCart.totalAfterDiscount;
    } else {
      finalAmount = findUserCart.cartTotal;
    }

    const newOrder = await new Order({
      products: findUserCart.products,
      paymentMethod: {
        id: uuidv4(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderBy: findUser.id,
      orderStatus: "Cash on Delivery",
    }).save();
    //Each operation specifies a filter to identify the relevant documents and an update operation to modify
    //their quantity and sold fields based on the values in findUserCart.products.
    let update = findUserCart.products.map((item) => {
      return {
        updateOne: {
          //check if `id` in databse matches `item.product.id`
          filter: { id: item.product.id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});

    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Order
const getOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateID(id);
  try {
    const userOrder = await Order.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  validateID(id);
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentMethod: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(findOrder);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
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
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
