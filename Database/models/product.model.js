const mongoose = require("mongoose");

const { Types } = mongoose;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minLength: 4,
      maxLength: 30,
      unique: true,
    },
    caption: {
      type: String,
      default: "no caption",
    },
    images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
        folderId: { type: String, required: true, unique: true },
      },
    ],
    addBy: { type: Types.ObjectId, ref: "User" },
    numberOfLikes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
