const commentModel = require("../../../Database/models/comment.model.js");
const productModel = require("../../../Database/models/product.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { _id } = req.user;
    const { productId } = req.params;

    //check product id
    const product = await productModel.findById(productId);
    if (!product) return First(res, "Product not found", 404, http.FAIL);

    //create Comment
    const comment = await commentModel.create({
      content,
      addBy: _id,
      productId,
    });
    Second(res, ["Comment created Successfully", comment], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = { addComment };
