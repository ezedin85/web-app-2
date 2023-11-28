const express = require("express");
const router = express.Router();
const {
  getOrder,
  addOrder,
  getOrders,
  setSoldValue,
  deleteOrder,
} = require("../controllers/orderController");
const adminAuth = require("../middlewares/adminAuth");

// /api/orders/add
router.post("/add", addOrder);

// api/orders/64db3d0d9285e79e6ed506ef
router.get("/:id", adminAuth(['super', 'regular']), getOrder);

// api/orders/
router.get("/", adminAuth(['super', 'regular']), getOrders);

// api/orders/64db3d0d9285e79e6ed506ef
router.patch("/set-sold-value/:id", adminAuth(['super', 'regular']), setSoldValue);

// api/orders/64db3d0d9285e79e6ed506ef
router.delete("/:id", adminAuth(['super', 'regular']), deleteOrder);

module.exports = router;
