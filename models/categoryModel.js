const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategories: { 
        type: [String],
        required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
