const cloudinary = require("../cloudinary/cloudinary");
const Product = require("../models/productModel");

const addProduct = async (req, res) => {

  const { name, price, image, category, sub_category, soldOut } = req.body;

  try {
    const img = await cloudinary.uploader.upload(image, {
      allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
    });
    
    const img_url = img.secure_url;

    if (!name || !category || !sub_category || !price)
      throw Error(
        "The field name, category, sub category and price are required"
      );

    const prevProduct = await Product.findOne({ name });
    if (prevProduct) throw Error("Product name is taken");

    const product = await Product.create({
      name,
      price,
      img_url,
      category,
      sub_category,
      soldOut,
    });
    res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product === null) throw Error("no Product found");
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Product.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      throw Error("Product not found");
    }
    res.status(202).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  deleteProduct,
};
