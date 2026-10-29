const express = require("express");
const protect = require("../middleware/authmiddleware");
const admin = require("../middleware/adminmiddleware");
const { getProducts, createProduct, getProductsById, updateProducts, deleteProducts } = require("../controller/productController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct);
router.route("/:id").get(getProductsById)
    .put(protect, admin, upload.single("image"), updateProducts)
    .delete(protect, admin, deleteProducts);

module.exports = router;