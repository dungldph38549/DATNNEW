// controllers/WalletController.js
const WalletService = require("../services/WalletService.js");
const Wallet = require("../models/Wallet.js");
const WalletTransaction = require("../models/WalletTransaction.js");

// Lấy thông tin ví của user
const getWalletInfo = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const wallet = await WalletService.getOrCreateWallet(userId);

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched wallet info",
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
        lastTransactionAt: wallet.lastTransactionAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Lấy lịch sử giao dịch
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, type } = req.query;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const result = await WalletService.getTransactionHistory(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
    });

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched transaction history",
      data: result.transactions,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Admin: Lấy thống kê ví
const getWalletStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const [totalWallets, totalBalance, totalTransactions, refundStats] =
      await Promise.all([
        // Tổng số ví
        Wallet.countDocuments({ isActive: true }),

        // Tổng số dư
        Wallet.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: "$balance" } } },
        ]),

        // Tổng giao dịch
        WalletTransaction.countDocuments({
          createdAt: { $gte: start, $lte: end },
        }),

        // Thống kê refund
        WalletTransaction.aggregate([
          {
            $match: {
              type: "refund",
              createdAt: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              totalRefunds: { $sum: 1 },
              totalRefundAmount: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched wallet statistics",
      data: {
        totalWallets,
        totalBalance: totalBalance[0]?.total || 0,
        totalTransactions,
        refunds: {
          totalRefunds: refundStats[0]?.totalRefunds || 0,
          totalRefundAmount: refundStats[0]?.totalRefundAmount || 0,
        },
        period: { startDate: start, endDate: end },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Admin: Xem chi tiết ví user
const getUserWalletDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const [wallet, recentTransactions] = await Promise.all([
      Wallet.findOne({ userId }).populate("userId", "name email"),
      WalletTransaction.find({ userId })
        .populate("metadata.orderId")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    if (!wallet) {
      return res.status(404).json({
        status: "error",
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched wallet detail",
      data: {
        wallet,
        recentTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getWalletInfo,
  getTransactionHistory,
  getWalletStatistics,
  getUserWalletDetail,
};
