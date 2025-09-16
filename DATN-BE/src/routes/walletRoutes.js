const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const {
  authenticateToken,
  isAdmin,
  isUserOrAdmin,
} = require("../middlewares/auth");

// Middleware để check ownership hoặc admin
const checkWalletAccess = (req, res, next) => {
  const { userId } = req.params;
  const requestingUserId = req.user.id;
  const isAdminUser = req.user.isAdmin;

  if (isAdminUser || requestingUserId === userId) {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập ví này" });
  }
};

// ==== USER ROUTES ====
// Get my wallet
router.get("/my-wallet", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await walletController.getOrCreateWallet(userId);
    await wallet.populate("userId", "name email");

    res.status(200).json({
      status: "success",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my wallet transactions
router.get("/my-wallet/transactions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    req.params.userId = userId;
    await walletController.getWalletTransactions(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific user wallet (with access control)
router.get(
  "/user/:userId",
  authenticateToken,
  checkWalletAccess,
  walletController.getUserWallet
);

// Get user wallet transactions (with access control)
router.get(
  "/user/:userId/transactions",
  authenticateToken,
  checkWalletAccess,
  walletController.getWalletTransactions
);

// ==== ADMIN ROUTES ====
// Get all wallets (admin only)
router.get(
  "/admin/all",
  authenticateToken,
  isAdmin,
  walletController.getAllWallets
);

// Withdraw money from user wallet (admin only)
router.post(
  "/admin/withdraw",
  authenticateToken,
  isAdmin,
  walletController.withdrawMoney
);

// Get wallet statistics (admin only)
router.get(
  "/admin/statistics",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate
        ? new Date(startDate)
        : new Date(new Date().getFullYear(), 0, 1);
      const end = endDate ? new Date(endDate) : new Date();

      const UserWallet = require("../models/userWallet");

      const [
        totalWallets,
        activeWallets,
        totalBalance,
        totalTransactions,
        refundTransactions,
      ] = await Promise.all([
        UserWallet.countDocuments(),
        UserWallet.countDocuments({ balance: { $gt: 0 } }),
        UserWallet.aggregate([
          { $group: { _id: null, total: { $sum: "$balance" } } },
        ]),
        UserWallet.aggregate([
          { $project: { transactionCount: { $size: "$transactions" } } },
          { $group: { _id: null, total: { $sum: "$transactionCount" } } },
        ]),
        UserWallet.aggregate([
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.type": "refund",
              "transactions.createdAt": { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalAmount: { $sum: "$transactions.amount" },
            },
          },
        ]),
      ]);

      res.status(200).json({
        totalWallets,
        activeWallets,
        inactiveWallets: totalWallets - activeWallets,
        totalBalance: totalBalance[0]?.total || 0,
        totalTransactions: totalTransactions[0]?.total || 0,
        refundStats: {
          count: refundTransactions[0]?.count || 0,
          totalAmount: refundTransactions[0]?.totalAmount || 0,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Bulk operations (admin only)
router.post(
  "/admin/bulk-withdraw",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userIds, amount, description } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "Danh sách user không hợp lệ" });
      }

      const results = [];
      const errors = [];

      for (const userId of userIds) {
        try {
          await walletController.withdrawMoney(
            { body: { userId, amount, description } },
            {
              status: () => ({ json: () => {} }),
              json: () => {},
            }
          );
          results.push({ userId, success: true });
        } catch (error) {
          errors.push({ userId, error: error.message });
        }
      }

      res.status(200).json({
        message: "Bulk withdrawal completed",
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ==== TRANSACTION ROUTES ====
// Create manual transaction (admin only)
router.post(
  "/admin/transaction",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId, type, amount, description, orderId } = req.body;

      if (!["refund", "deposit", "withdrawal"].includes(type)) {
        return res.status(400).json({ message: "Loại giao dịch không hợp lệ" });
      }

      const wallet = await walletController.getOrCreateWallet(userId);

      if (type === "withdrawal" && wallet.balance < amount) {
        return res.status(400).json({ message: "Số dư không đủ" });
      }

      if (type === "withdrawal") {
        wallet.subtractMoney(amount, type, description);
      } else {
        wallet.addMoney(amount, type, description, orderId);
      }

      await wallet.save();

      res.status(200).json({
        message: "Tạo giao dịch thành công",
        wallet: {
          balance: wallet.balance,
          transaction: wallet.transactions[wallet.transactions.length - 1],
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get transaction by ID
router.get(
  "/transaction/:transactionId",
  authenticateToken,
  async (req, res) => {
    try {
      const { transactionId } = req.params;
      const UserWallet = require("../models/userWallet");

      const wallet = await UserWallet.findOne(
        { "transactions._id": transactionId },
        { "transactions.$": 1, userId: 1, balance: 1 }
      ).populate("userId", "name email");

      if (!wallet) {
        return res.status(404).json({ message: "Không tìm thấy giao dịch" });
      }

      // Check access permission
      const isOwner = wallet.userId._id.toString() === req.user.id;
      const isAdminUser = req.user.isAdmin;

      if (!isOwner && !isAdminUser) {
        return res
          .status(403)
          .json({ message: "Không có quyền truy cập giao dịch này" });
      }

      res.status(200).json({
        status: "success",
        data: {
          transaction: wallet.transactions[0],
          wallet: {
            userId: wallet.userId,
            balance: wallet.balance,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update wallet status (admin only)
router.patch(
  "/admin/user/:userId/status",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      const UserWallet = require("../models/userWallet");
      const wallet = await UserWallet.findOneAndUpdate(
        { userId },
        { isActive },
        { new: true }
      ).populate("userId", "name email");

      if (!wallet) {
        return res.status(404).json({ message: "Không tìm thấy ví" });
      }

      res.status(200).json({
        message: `Đã ${isActive ? "kích hoạt" : "tạm khóa"} ví thành công`,
        wallet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
