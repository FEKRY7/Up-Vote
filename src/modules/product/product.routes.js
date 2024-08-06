const express = require("express");
const productRouter = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");

const {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} = require("./product.controller.js");

const { multerHost } = require("../../utils/fileUpload.js");
const allowedExtensions = require("../../utils/allowedExtensions.js");

//Add Product ************************************************
productRouter.post(
  "/v1/product",
  isAuthenticated,
  multerHost({
    extensions: allowedExtensions.image,
  }).array("images", 2),
  addProduct
);
 
//Update Product ************************************************
productRouter.put(
  "/v1/product/:productId",
  isAuthenticated,
  multerHost({
    extensions: allowedExtensions.image,
  }).single("images"),
  updateProduct
);

//Delete Product ************************************************
productRouter.delete("/v1/product/:productId", isAuthenticated, deleteProduct);

//Get All Products ************************************************
productRouter.get("/v1/product", isAuthenticated, getAllProducts);

module.exports = productRouter;
