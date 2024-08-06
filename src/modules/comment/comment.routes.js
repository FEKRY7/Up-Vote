const express = require("express");
const commentRouter = express.Router();

const isAuthenticated = require("../../middleware/authentication.middeleware.js");

const {
    addComment
} = require("./comment.controller.js");

commentRouter.post('/:productId', isAuthenticated, addComment);


module.exports = commentRouter;