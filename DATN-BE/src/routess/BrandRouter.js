// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.post("/admin/create", authAdminMiddleware, BrandController.create);
router.get("/admin/list", BrandController.getAll);
router.put("/admin/update", authAdminMiddleware, BrandController.update);
router.delete("/admin/delete", authAdminMiddleware, BrandController.delete);
router.get("/admin/detail/:id", BrandController.getOne);

module.exports = router;
