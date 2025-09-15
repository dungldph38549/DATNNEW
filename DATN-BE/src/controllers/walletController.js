// controllers/walletController.js
const mongoose = require("mongoose");
const UserWallet = require("../models/userWallet.js");
const User = require("../models/UserModel.js");

// Tạo hoặc lấy ví của user
exports.getOrCreateWallet = async (userId) => {
  try {
    let wallet = await UserWallet.findOne({ userId });
    if (!wallet) {
      wallet = new UserWallet({ userId });
      await wallet.save();
    }
    return wallet;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin ví của user
exports.getUserWallet = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "User ID không hợp lệ" });
    }

    const wallet = await this.getOrCreateWallet(userId);
    await wallet.populate("userId", "name email");

    res.status(200).json({
      status: "success",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm tiền vào ví (refund)
exports.addMoneyToWallet = async (userId, amount, orderId, description) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await this.getOrCreateWallet(userId);
    wallet.addMoney(amount, "refund", description, orderId);
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Lấy lịch sử giao dịch
exports.getWalletTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "User ID không hợp lệ" });
    }

    const wallet = await UserWallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Ví không tồn tại" });
    }

    let transactions = wallet.transactions;

    // Filter by type if specified
    if (type && ["refund", "withdrawal", "deposit"].includes(type)) {
      transactions = transactions.filter((t) => t.type === type);
    }

    // Sort by creation date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.status(200).json({
      status: "success",
      data: {
        balance: wallet.balance,
        transactions: paginatedTransactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(transactions.length / limit),
          totalTransactions: transactions.length,
          hasNextPage: endIndex < transactions.length,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rút tiền từ ví (admin only)
exports.withdrawMoney = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "User ID không hợp lệ" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Số dư không đủ" });
    }

    wallet.subtractMoney(
      amount,
      "withdrawal",
      description || "Rút tiền khỏi ví"
    );
    await wallet.save();

    res.status(200).json({
      status: "success",
      message: "Rút tiền thành công",
      data: {
        newBalance: wallet.balance,
        amount: amount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tổng quan ví của tất cả user (admin only)
exports.getAllWallets = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let matchQuery = {};
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      matchQuery.userId = { $in: users.map((u) => u._id) };
    }

    const wallets = await UserWallet.find(matchQuery)
      .populate("userId", "name email")
      .sort({ balance: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UserWallet.countDocuments(matchQuery);

    res.status(200).json({
      status: "success",
      data: wallets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
