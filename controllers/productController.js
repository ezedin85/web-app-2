const cloudinary = require("../cloudinary/cloudinary");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const addProduct = async (req, res) => {
  try {
    const { name, price, category, sub_category, soldOut } = req.body;
    const prevProduct = await Product.findOne({ name });
    if (prevProduct) throw Error("Product name is taken");

    if (!name || !category || !sub_category || !price)
      throw Error(
        "The field name, category, sub category and price are required"
      );

    //upload the image to cloudinary
    cloudinary.uploader.upload(req.file.path, async function (err, result) {
      if (err)
        return res
          .status(500)
          .json({ error: "Error while uploading the image" });

      // if image uploaded successfully
      const image = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };

      const product = await Product.create({
        name,
        price,
        image,
        category,
        sub_category,
        soldOut,
      });
      res.status(201).json(product);
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw Error("not a valid id");
    }
    const product = await Product.findById(id);
    if (product === null) throw Error("no Product found");
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort("-createdAt");
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw Error("not a valid id");
    }

    const user = await Product.findById(id)
    await cloudinary.uploader.destroy(user.image?.public_id)

    const response = await Product.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      throw Error("Product not found");
    }
    res.status(202).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const { name, price, category, sub_category, soldOut } = req.body;

  try {

    const updatedData = await Product.findByIdAndUpdate(
      id,
      { name, price, category, sub_category, soldOut },
      { new: true, runValidators: true }
    );
    res.json(updatedData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct
};
