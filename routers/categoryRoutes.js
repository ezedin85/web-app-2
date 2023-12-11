const express = require("express");
const router = express.Router();
const {
    getCategory, addCategory, getCategories, updateCategory, deleteCategory
} = require("../controllers/categoryController");
const adminAuth = require("../middlewares/adminAuth");

// /api/categories/add
router.post("/add", adminAuth(['super', 'regular']), addCategory);

// api/categories/64db3d0d9285e79e6ed506ef
router.get("/:id", getCategory);

// api/categories/
router.get("/",  getCategories);

// api/categories/64db3d0d9285e79e6ed506ef
router.patch("/:id", adminAuth(['super', 'regular']), updateCategory);

// api/categories/64db3d0d9285e79e6ed506ef
router.delete("/:id", adminAuth(['super', 'regular']), deleteCategory);

module.exports = router;
