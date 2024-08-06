const jwt = require('jsonwebtoken');
const tokenModel = require('./../../Database/models/token.model.js');
const userModel = require('./../../Database/models/user.model.js');
const http = require('../folderS,F,E/S,F,E.JS')
const {First,Second,Third} = require('../utils/httperespons')

const isAuthenticated = async (req, res) => {
  try {
    // Checking token existence
    const token = req.headers.token;
    
    if (!token) {
      return First(res,"Token is required",400,http.FAIL)
    }

    // Checking token validation
    const tokenDb = await tokenModel.findOne({ token, isValid: true });
    if (!tokenDb) {
      return First(res,"Expired Token",400,http.FAIL)
    }

    // Checking user validation
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(payload._id);
    if (!user) {
      return First(res,"User not found",400,http.FAIL)
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return First(res,'Invalid token',400,http.FAIL)
    }
    return Third(res,"Server error during authentication",500,http.FAIL)
  }
};

module.exports = isAuthenticated;
