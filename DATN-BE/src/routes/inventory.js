const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authenticateToken);

// Create inventory transaction (Staff/Admin only)
router.post(
  "/transactions",
  requireAdmin,
  inventoryController.createInventoryTransaction
);

// Get inventory history
router.get("/history", inventoryController.getInventoryHistory);

// Get inventory statistics
router.get("/stats", inventoryController.getInventoryStats);

// Bulk update inventory (Admin only)
router.post(
  "/bulk-update",
  requireAdmin,
  inventoryController.bulkUpdateInventory
);

// Get current stock levels
router.get("/stocks", inventoryController.getCurrentStocks);

module.exports = router;
