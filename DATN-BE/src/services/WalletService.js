const mongoose = require("mongoose");
const Wallet = require("../models/Wallet.js");
const WalletTransaction = require("../models/WalletTransaction.js");
const User = require("../models/UserModel.js");

class WalletService {
  // Tạo ví mới cho user
  static async createWallet(userId, session = null) {
    try {
      const existingWallet = await Wallet.findOne({ userId }).session(session);
      if (existingWallet) {
        return existingWallet;
      }

      const wallet = new Wallet({ userId });
      return await wallet.save({ session });
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  // Lấy hoặc tạo ví
  static async getOrCreateWallet(userId, session = null) {
    try {
      let wallet = await Wallet.findOne({ userId }).session(session);
      if (!wallet) {
        wallet = await this.createWallet(userId, session);
      }
      return wallet;
    } catch (error) {
      throw new Error(`Failed to get or create wallet: ${error.message}`);
    }
  }

  // Xử lý hoàn tiền
  static async processRefund({
    userId,
    amount,
    orderId,
    returnId,
    description,
    adminNote = null,
    refundReason = null,
    session = null,
  }) {
    try {
      if (amount <= 0) {
        throw new Error("Refund amount must be greater than 0");
      }

      // Lấy hoặc tạo ví
      const wallet = await this.getOrCreateWallet(userId, session);
      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore + amount;

      // Tạo transaction record
      const transaction = new WalletTransaction({
        walletId: wallet._id,
        userId,
        type: "refund",
        amount,
        balanceBefore,
        balanceAfter,
        status: "completed",
        description,
        referenceId: orderId.toString(),
        referenceType: "return",
        metadata: {
          orderId,
          returnId,
          adminNote,
          refundReason,
        },
      });

      await transaction.save({ session });

      // Cập nhật số dư ví
      wallet.balance = balanceAfter;
      wallet.lastTransactionAt = new Date();
      await wallet.save({ session });

      return {
        transaction,
        wallet,
        newBalance: balanceAfter,
      };
    } catch (error) {
      throw new Error(`Refund processing failed: ${error.message}`);
    }
  }

  // Lấy số dư ví
  static async getWalletBalance(userId) {
    try {
      const wallet = await Wallet.findOne({ userId });
      return wallet ? wallet.balance : 0;
    } catch (error) {
      throw new Error(`Failed to get wallet balance: ${error.message}`);
    }
  }

  // Lấy lịch sử giao dịch
  static async getTransactionHistory(
    userId,
    { page = 1, limit = 20, type = null } = {}
  ) {
    try {
      const query = { userId };
      if (type) query.type = type;

      const transactions = await WalletTransaction.find(query)
        .populate("metadata.orderId")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await WalletTransaction.countDocuments(query);

      return {
        transactions,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }

  // Kiểm tra ví có đủ tiền không (cho thanh toán)
  static async hasSufficientBalance(userId, amount) {
    try {
      const balance = await this.getWalletBalance(userId);
      return balance >= amount;
    } catch (error) {
      return false;
    }
  }

  // Trừ tiền ví (cho thanh toán)
  static async deductBalance({
    userId,
    amount,
    orderId,
    description,
    session = null,
  }) {
    try {
      const wallet = await this.getOrCreateWallet(userId, session);

      if (wallet.balance < amount) {
        throw new Error("Insufficient wallet balance");
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore - amount;

      // Tạo transaction
      const transaction = new WalletTransaction({
        walletId: wallet._id,
        userId,
        type: "payment",
        amount: -amount, // Số âm cho payment
        balanceBefore,
        balanceAfter,
        status: "completed",
        description,
        referenceId: orderId.toString(),
        referenceType: "order",
        metadata: { orderId },
      });

      await transaction.save({ session });

      // Cập nhật ví
      wallet.balance = balanceAfter;
      wallet.lastTransactionAt = new Date();
      await wallet.save({ session });

      return {
        transaction,
        wallet,
        newBalance: balanceAfter,
      };
    } catch (error) {
      throw new Error(`Balance deduction failed: ${error.message}`);
    }
  }
}

module.exports = WalletService;
