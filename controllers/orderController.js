const Order = require("../models/orderModel");

const addOrder = async (req, res) => {
  const { customer_name, phone, products, status } = req.body;

  try {
    if (!products || products.length <= 0)
      throw Error("Please add at least one product");
    if (!customer_name || !phone)
      throw Error("Customer name and Phone are required fileds!");

    const json = await Order.create({ customer_name, phone, products, status });
    res.status(201).json(json);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("products.product", "name");

    if (order === null) throw Error("no order found by this id!");
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setSoldValue = async (req, res) => {
  const {id} = req.params
  const { products } = req.body

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { products },
      { new: true, runValidators: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }

};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Order.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      throw Error("Order not found");
    }
    res.status(202).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getOrder, addOrder, getOrders, deleteOrder, setSoldValue };
