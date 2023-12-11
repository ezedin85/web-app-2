const express = require("express");
const router = express.Router();
const {
  deleteProduct,
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
} = require("../controllers/productController");
const adminAuth = require("../middlewares/adminAuth");
const uploadFile = require("../middlewares/multer");

router.post("/add", adminAuth(['super', 'regular']), uploadFile, addProduct);


// api/products/64db3d0d9285e79e6ed506ef
router.get("/:id", getProduct);

// api/products/
router.get("/", getProducts);

// api/products/64db3d0d9285e79e6ed506ef
router.delete("/:id", adminAuth(['super', 'regular']), deleteProduct);

// api/products/64db3d0d9285e79e6ed506ef
router.patch("/:id", adminAuth(['super', 'regular']), uploadFile, updateProduct);

module.exports = router;