const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sub_category: {
      type: String,
      required: true,
      trim: true,
    },
    img_url: String,
    price: {
        type: Number,
        required: true
    },
    soldOut: {
        type: Boolean,
        required: true,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", adminSchema);