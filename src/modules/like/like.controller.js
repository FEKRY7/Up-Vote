const likesModel = require("../../../Database/models/like.model.js");
const commentModel = require("../../../Database/models/comment.model.js");
const productModel = require("../../../Database/models/product.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

//create Like************************************************
const likeOrUnlike = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { _id } = req.user;
    const { onModel } = req.body;

    //check if product exists
    const product = await productModel.findById(productId);
    if (!product) return First(res, "Product not found", 404, http.FAIL);

    // check
    const isAlreadyLiked = await likesModel.findOne({
      likedBy: _id,
      likeDoneId: productId,
    });
    if (isAlreadyLiked) {
      await likesModel.findOneAndDelete({
        likedBy: _id,
        likeDoneId: productId,
      });
      product.numberOfLikes--;
      await product.save();
      Second(
        res,
        ["Like deleted successfully", { product: product.numberOfLikes }],
        201,
        http.SUCCESS
      );
    }

    //create like document
    const like = await likesModel.create({
      likedBy: _id,
      onModel,
      likeDoneId: productId,
      productId,
    });
    product.numberOfLikes++;
    await product.save();
    Second(
      res,
      [
        "Like created successfully",
        { data: like, product: product.numberOfLikes },
      ],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//get all Likes ************************************************
const getAllLikesProduct = async (req, res, next) => {
  try {
    const likes = await likesModel
      .find({ likeDoneId: req.params.productId })
      .populate([
        {
          path: "likeDoneId",
        },
      ]);
    Second(res, ["success", likes], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Comment Likes ************************************************
const likeUnLikeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { _id } = req.user;
    const { onModel } = req.body;

    //check product Id
    const comment = await commentModel.findById(commentId);
    if (!comment) return First(res, "Comment not found", 404, http.FAIL);

    // check if likes
    const isAlreadyLiked = await likesModel.findOne({
      likedBy: _id,
      likeDoneId: commentId,
    });
    if (isAlreadyLiked) {
      await likesModel.findOneAndDelete({
        likedBy: _id,
        likeDoneId: commentId,
      });
      comment.numberOfLikes -= 1;
      await comment.save();
      Second(
        res,
        ["UnLike Done", { count: comment.numberOfLikes }],
        201,
        http.SUCCESS
      );
    }
    //create like document
    const like = await likesModel.create({
      likedBy: _id,
      onModel,
      likeDoneId: commentId,
    });
    console.log(like);

    comment.numberOfLikes += 1;
    await comment.save();
    Second(
      res,
      ["Like Done", { count: comment.numberOfLikes }],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//Get User Likes History ************************************************
const getUserHistory = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const likes = await likesModel
      .find({
        likedBy: _id,
        onModel: req.query.onModel, //optional
      })
      .populate([
        {
          path: "likeDoneId",
          populate: {
            path: "addBy",
            select: "name",
          },
        },
      ]);
    Second(res, ["success", likes], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  likeOrUnlike,
  getAllLikesProduct,
  likeUnLikeComment,
  getUserHistory,
};
