// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.post("/create", ProductController.createProduct);
router.get("/getAll", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/update/:id", ProductController.updateProduct);
router.delete("/delete/:id", ProductController.deleteProduct);

module.exports = router;
