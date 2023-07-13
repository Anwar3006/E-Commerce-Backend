require("dotenv").config();
const express = require("express");
const dbConnect = require("./db/dbClient");
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5050;
const app = express();
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const productCategoryRoute = require("./routes/productCategoryRoute");
const blogCategoryRoute = require("./routes/blogCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/users", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1", productCategoryRoute);
app.use("/api/v1", blogCategoryRoute);
app.use("/api/v1", brandRoute);
app.use("/api/v1", couponRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await dbConnect(mongoUri);
    console.log(`Server is running on port: ${PORT}...`);
  } catch (error) {
    console.error(error);
  }
});
