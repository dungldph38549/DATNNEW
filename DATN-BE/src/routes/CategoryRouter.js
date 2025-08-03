// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.post("/admin/create", authAdminMiddleware, CategoryController.create);
router.get("/admin/list", CategoryController.getAll);
router.put("/admin/update", authAdminMiddleware, CategoryController.update);
router.delete("/admin/delete", authAdminMiddleware, CategoryController.delete);
router.get("/admin/detail/:id", CategoryController.getOne);

module.exports = router;
