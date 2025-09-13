// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authAdminMiddleware, ProductController.createProduct);
router.get("/getAll", authAdminMiddleware, ProductController.getAllProducts);
router.post("/user/list", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/relationProduct", ProductController.relationProduct);
router.put("/update/:id", authAdminMiddleware, ProductController.updateProduct);
router.delete("/delete/:id", authAdminMiddleware, ProductController.deleteProductById);
router.put("/restore/:id", authAdminMiddleware, ProductController.restoreProductById);
router.delete("/delete", authAdminMiddleware, ProductController.deleteProduct);

module.exports = router;
