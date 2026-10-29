const express = require("express");
const { createOrder, getOrders, myOrders, updateOrderStatus } = require("../controller/orderController");
const protect = require("../middleware/authmiddleware");
const admin = require("../middleware/adminmiddleware");

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route("/myorders").get(protect, myOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
