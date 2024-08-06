const mongoose = require("mongoose");

const { Types } = mongoose;

const commentSchema = new mongoose.Schema(
  {
    content: { 
      type: String, 
      required: true 
    }, 
    addBy: { 
      type: Types.ObjectId,
      ref: "User" 
    },
    productId: { 
      type: Types.ObjectId, 
      ref: "Product" 
    },
    numberOfLikes: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
  },

  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
