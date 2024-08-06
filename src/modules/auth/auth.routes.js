const express = require("express");
const userRouter = express.Router();

const { validation } = require("./../../middleware/validation.middleware.js");
const isAuthenticated = require("../../middleware/authentication.middeleware.js");

const { SignUpSchema, signInSchema } = require("./auth.schema..js");

const {
  demoHost,
  getUserProfile,
  profileHost,
  signInHandler,
  signUpHandler,
  testPhotoProfile,
} = require("./auth.controller.js");

const { multerHost, multerMiddle } = require("../../utils/fileUpload.js");
const allowedExtensions = require("../../utils/allowedExtensions.js");

// "[ ]"sign up user
userRouter.post("/v1/signupuser", validation(SignUpSchema), signUpHandler);

// "[ ]"sign In user
userRouter.post("/v1/signinuser", validation(signInSchema), signInHandler);

// "[ ]"userprofile
userRouter.get("/v1/userprofile", isAuthenticated, getUserProfile); //auth,

// "[ ]"userprofile photo //host
userRouter.post(
  "/v1/uploadHost",
  multerHost({
    extensions: allowedExtensions.image,
  }).single("profile"),
  profileHost
);

// "[ ]"userprofile cv   //host
userRouter.post(
  "/v1/uploadVideoHost",
  multerHost({
    extensions: allowedExtensions.video,
  }).single("demo"),
  demoHost
);

// "[ ]"userprofile photo send many //local
userRouter.post(
  "/v1/upload",
  multerMiddle({
    extensions: allowedExtensions.image,
    filePath: "customer/profiles",
  }).fields([
    { name: "profile", maxCount: 2 },
    { name: "profile1", maxCount: 1 },
    { name: "profile2", maxCount: 2 },
  ]),
  testPhotoProfile
);

module.exports = userRouter;
