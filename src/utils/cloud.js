const cloudinary = require('cloudinary').v2
require('dotenv').config()

const cloudinaryConnection = () => {
  cloudinary.config({
    cloud_name: process.env.COLUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  return cloudinary;
};

module.exports = cloudinaryConnection;