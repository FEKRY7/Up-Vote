const jwt = require("jsonwebtoken");
const tokenModel = require("../../../Database/models/token.model.js");
const userModel = require("../../../Database/models/user.model.js");
const bcrypt = require("bcrypt");
const cloudinaryConnection = require("../../utils/cloud.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

//signUp************************************************
const signUpHandler = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, role } = req.body;
    const isEmailExists = await userModel.findOne({ email });
    if (isEmailExists) {
      return First(res, "Email is Already exists", 409, http.FAIL);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      role,
    });
    Second(res, ["User created successfully", newUser], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//signIn************************************************
const signInHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return First(res, "Invalid Email", 404, http.FAIL);
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return First(res, "Invalid login credentials", 401, http.FAIL);
    }

    // Generate token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "11m" } // Set token expiration to 4 minutes
    );

    // Set token expiration time in mongoose
    const expireAt = new Date();
    expireAt.setTime(expireAt.getTime() + 1000 * 60 * 4);
    await tokenModel.create({ token, userId: user._id, expireAt });

    Second(res, ["User login successfully", token], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//get User Profile************************************************
const getUserProfile = async (req, res) => {
  //req.user come from auth.middleware
  Second(res, ["User profile", req.user], 201, http.SUCCESS);
};

//test photo Profile************************************************
const testPhotoProfile = async (req, res, next) => {
  Second(res, ["User profile", req.files], 201, http.SUCCESS);
};

//test photo Profile Host************************************************
const profileHost = async (req, res, next) => {
  //upload on cloudinary server
  console.log(req.file);
  const data = await cloudinaryConnection().uploader.upload(req.file.path, {
    folder: "upvote/profiles",
    public_id: req.file.filename,
  });
  Second(res, ["User data", data], 201, http.SUCCESS);
};

//test demo Profile Host************************************************
const demoHost = async (req, res, next) => {
  const data = await cloudinaryConnection().uploader.upload(req.file.path, {
    folder: "upvote/videos",
    resource_type: "video",
  });
  Second(res, ["User data", data], 201, http.SUCCESS);
};

module.exports = {
  signUpHandler,
  signInHandler,
  getUserProfile,
  testPhotoProfile,
  profileHost,
  demoHost,
};
