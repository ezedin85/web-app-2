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

router.use(adminAuth(['super', 'regular']),);

// /api/orders/add
router.post("/add", addOrder);

// api/orders/64db3d0d9285e79e6ed506ef
router.get("/:id", getOrder);

// api/orders/
router.get("/", getOrders);

// api/orders/64db3d0d9285e79e6ed506ef
router.patch("/set-sold-value/:id", setSoldValue);

// api/orders/64db3d0d9285e79e6ed506ef
router.delete("/:id", deleteOrder);

module.exports = router;
