// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const ReviewProductController = require("../controllers/ReviewProductController");

router.post("/create", ReviewProductController.create);
router.post("/replies", ReviewProductController.repliesReview);
router.get("/:productId", ReviewProductController.reviewsByProduct);

module.exports = router;
