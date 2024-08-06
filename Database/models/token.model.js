const mongoose = require('mongoose')

const {Types} = mongoose

const accessToken = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);



const tokenModel = mongoose.model('token', accessToken);
module.exports = tokenModel;