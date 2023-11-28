const express = require("express");
const router = express.Router();
const {
  deleteProduct,
  getProducts,
  addProduct,
  getProduct,
  img
} = require("../controllers/productController");
const adminAuth = require("../middlewares/adminAuth");


// /api/products/add
router.post("/add", adminAuth(['super', 'regular']), addProduct);

// api/products/64db3d0d9285e79e6ed506ef
router.get("/:id", getProduct);

// api/products/
router.get("/", getProducts);

// api/products/64db3d0d9285e79e6ed506ef
router.delete("/:id", adminAuth(['super', 'regular']), deleteProduct);

module.exports = router;