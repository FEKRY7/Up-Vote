const commentModel = require("../../../Database/models/comment.model.js");
const productModel = require("../../../Database/models/product.model.js");
const cloudinaryConnection = require("../../utils/cloud.js");
const generateUniqueString = require("../../utils/generateUniqueString.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

//Add Product ************************************************
const addProduct = async (req, res, next) => {
  try {
    const { title, caption } = req.body;
    const { _id } = req.user;
    let images = [];
    let publicIdsArr = [];
    if (!req.files?.length)
      return First(res, "Please Upload at least one", 400, http.FAIL);

    const folderId = generateUniqueString(5);
    for (const file of req.files) {
      const { secure_url, public_id } =
        await cloudinaryConnection().uploader.upload(file.path, {
          folder: `upVoteImages/products/${_id}/${folderId}`,
        });
      publicIdsArr.push(public_id);
      images.push({ secure_url, public_id, folderId });
    }
    const product = await productModel.create({
      title,
      caption,
      images,
      addBy: _id,
    });
    //if Not Product
    if (!product) {
      const data = await cloudinaryConnection().api.delete_resources(
        publicIdsArr
      );
      return First(res, "Error While Created Product", 500, http.FAIL);
    }
    return Second(
      res,
      ["Product created successfully", product],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Update Product ************************************************
const updateProduct = async (req, res, next) => {
  try {
    const { title, caption, oldPublicId } = req.body;
    const { _id } = req.user;
    const { productId } = req.params;

    //check if product
    const product = await productModel.findOne({ addBy: _id, _id: productId });
    // console.log(product);
    if (!product) return First(res, "Product not found", 404, http.FAIL);

    //update product
    if (title) product.title = title;
    if (caption) product.caption = caption;

    if (oldPublicId) {
      if (!req.file)
        return First(res, "Please Upload the New Image", 400, http.FAIL);

      //delete old image from cloudinary
      await cloudinaryConnection().uploader.destroy(oldPublicId);
      //upload new image to cloudinary
      const { secure_url, public_id } =
        await cloudinaryConnection().uploader.upload(req.file.path, {
          folder: `upVoteImages/products/${_id}/${product.images[0].folderId}`,
        });

      //update url in DB
      product.images.map((image) => {
        if (image.public_id === oldPublicId) {
          image.public_id = public_id;
          image.secure_url = secure_url;
        }
        // return image;
      });
    }

    await product.save();
    return Second(
      res,
      ["Product updated successfully", product],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Delete Product ************************************************
const deleteProduct = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { productId } = req.params;

    //check
    const product = await productModel.findOneAndDelete({
      addBy: _id,
      _id: productId,
    });
    if (!product) return First(res, "Product not found", 404, http.FAIL);

    //create arr & push data to deleted
    let publicIdsArr = [];
    for (const image of product.images) {
      publicIdsArr.push(image.public_id);
    }
    await cloudinaryConnection().api.delete_resources(publicIdsArr);
    return Second(res, ["Product deleted successfully"], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Get All Products ************************************************
const getAllProducts = async (req, res, next) => {
  try {
    const products = productModel.find().cursor();
    let finalResult = [];
    for (
      let doc = await products.next();
      doc != null;
      doc = await products.next()
    ) {
      const comments = await commentModel.find({ productId: doc._id });
      const docObject = doc.toObject();
      docObject.comments = comments;
      finalResult.push(docObject);
    }
    return Second(res, ["done", finalResult], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = { addProduct, updateProduct, deleteProduct, getAllProducts };
