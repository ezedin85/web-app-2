const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

const addCategory = async (req, res) => {
  const { category, subCategories } = req.body;

  try {

    const item = await Category.findOne({ category });
    if (item) throw Error("The category name is already in use.");

    //check if there is 2 sub categories withe the same name
    if (hasDuplicates(subCategories))
      throw Error("Choose unique names for each subcategory");

    if (!category || subCategories.length <= 0)
      throw Error("Please fill all required fields!");

    const json = await Category.create({ category, subCategories });
    res.status(201).json(json);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      throw Error("not a valid id");
    }
    const category = await Category.findById(id);

    if (category === null) throw Error("no category found by this id!");
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort("-createdAt");
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category, subCategories } = req.body;

  try {
    const item = await Category.findOne({ category, _id: { $ne: id } });
    if (item) throw Error("The category name is already in use.");

    //check if there is 2 sub categories withe the same name
    if (hasDuplicates(subCategories))
      throw Error("Choose unique names for each subcategory");

    if (!mongoose.isValidObjectId(id)) {
      throw Error("not a valid id");
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, { category, subCategories }, {
      new: true,
      runValidators: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Category.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      throw Error("Order not found");
    }
    res.status(202).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCategory,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
