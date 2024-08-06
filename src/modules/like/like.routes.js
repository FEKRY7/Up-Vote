const express = require("express");
const likeRouter = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");

const {
  getAllLikesProduct,
  getUserHistory,
  likeOrUnlike,
  likeUnLikeComment,
} = require("./like.controller.js");

//like Product

likeRouter.post("/:productId", isAuthenticated, likeOrUnlike);
likeRouter.get("/:productId", getAllLikesProduct);
likeRouter.post("/likeC/:commentId", isAuthenticated, likeUnLikeComment);
likeRouter.get("/", isAuthenticated, getUserHistory);

module.exports = likeRouter;