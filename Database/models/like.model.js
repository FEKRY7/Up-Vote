const mongoose = require('mongoose')

const {Types} = mongoose

const likesSchema = new mongoose.Schema(
  {
    likedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    likeDoneId: {
      type: Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Product', 'User', 'Comment', 'Reply'],
    },
  },
  { timestamps: true }
);

const likesModel = mongoose.model('Like', likesSchema);

module.exports = likesModel