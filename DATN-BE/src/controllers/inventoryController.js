const InventoryTransaction = require("../models/InventoryTransaction");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");

// Tạo giao dịch kho (Nhập/Xuất/Điều chỉnh)
exports.createInventoryTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      productId,
      type, // 'in', 'out', 'adjust'
      sku, // For variant products
      quantity,
      reason,
      note,
      priceChange,
      batchInfo,
      staffId,
    } = req.body;

    // Validate required fields
    if (!productId || !type || !quantity || !reason || !staffId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Get product
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Validate staff
    const staff = await User.findById(staffId).session(session);
    if (!staff || (!staff.isAdmin && staff.role !== "staff")) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện thao tác này",
      });
    }

    let beforeStock, afterStock;
    let variantIndex = -1;

    // Handle variant products
    if (product.hasVariants && sku) {
      variantIndex = product.variants.findIndex((v) => v.sku === sku);
      if (variantIndex === -1) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy variant với SKU này",
        });
      }

      beforeStock = product.variants[variantIndex].stock;

      // Calculate new stock based on transaction type
      switch (type) {
        case "in":
          afterStock = beforeStock + Math.abs(quantity);
          break;
        case "out":
          afterStock = beforeStock - Math.abs(quantity);
          break;
        case "adjust":
          afterStock = Math.abs(quantity); // Direct adjustment
          break;
        default:
          throw new Error("Invalid transaction type");
      }

      // Validate stock doesn't go negative
      if (afterStock < 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Số lượng tồn kho không thể âm",
        });
      }

      // Update variant stock
      product.variants[variantIndex].stock = afterStock;

      // Update price if provided
      if (priceChange && priceChange.newPrice) {
        product.variants[variantIndex].price = priceChange.newPrice;
      }
    } else {
      // Handle regular products
      beforeStock = product.countInStock;

      switch (type) {
        case "in":
          afterStock = beforeStock + Math.abs(quantity);
          break;
        case "out":
          afterStock = beforeStock - Math.abs(quantity);
          break;
        case "adjust":
          afterStock = Math.abs(quantity);
          break;
        default:
          throw new Error("Invalid transaction type");
      }

      if (afterStock < 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Số lượng tồn kho không thể âm",
        });
      }

      product.countInStock = afterStock;

      // Update price if provided
      if (priceChange && priceChange.newPrice) {
        product.price = priceChange.newPrice;
      }
    }

    // Save product
    await product.save({ session });

    // Create inventory transaction record
    const transaction = new InventoryTransaction({
      productId,
      type,
      sku,
      quantity:
        type === "adjust"
          ? afterStock - beforeStock
          : type === "out"
          ? -Math.abs(quantity)
          : Math.abs(quantity),
      beforeStock,
      afterStock,
      priceChange: priceChange || null,
      reason,
      note,
      staffId,
      batchInfo: batchInfo || null,
    });

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate transaction for response
    const populatedTransaction = await InventoryTransaction.findById(
      transaction._id
    )
      .populate("productId", "name image")
      .populate("staffId", "fullName email");

    res.status(201).json({
      success: true,
      message: "Giao dịch kho thành công",
      data: populatedTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy lịch sử giao dịch kho
exports.getInventoryHistory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      productId,
      type,
      reason,
      staffId,
      startDate,
      endDate,
      sku,
    } = req.query;

    // Build filter
    const filter = {};
    if (productId) filter.productId = productId;
    if (type) filter.type = type;
    if (reason) filter.reason = reason;
    if (staffId) filter.staffId = staffId;
    if (sku) filter.sku = sku;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get transactions with pagination
    const transactions = await InventoryTransaction.find(filter)
      .populate("productId", "name image")
      .populate("staffId", "fullName email role")
      .populate("orderId", "_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await InventoryTransaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: skip + limitNum < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thống kê kho hàng
exports.getInventoryStats = async (req, res) => {
  try {
    const { startDate, endDate, productId } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    // Build match condition
    const matchCondition = {};
    if (startDate || endDate) matchCondition.createdAt = dateFilter;
    if (productId)
      matchCondition.productId = new mongoose.Types.ObjectId(productId);

    // Get basic stats
    const basicStats = await InventoryTransaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalQuantity: { $sum: { $abs: "$quantity" } },
        },
      },
    ]);

    // Get transactions by reason
    const reasonStats = await InventoryTransaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
          totalQuantity: { $sum: { $abs: "$quantity" } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get most active products
    const topProducts = await InventoryTransaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$productId",
          transactionCount: { $sum: 1 },
          totalQuantityChange: { $sum: { $abs: "$quantity" } },
        },
      },
      { $sort: { transactionCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          productImage: "$product.image",
          transactionCount: 1,
          totalQuantityChange: 1,
        },
      },
    ]);

    // Get daily transaction volume (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyVolume = await InventoryTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          ...matchCondition,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          transactionCount: { $sum: 1 },
          totalQuantity: { $sum: { $abs: "$quantity" } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          transactionCount: 1,
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        basicStats,
        reasonStats,
        topProducts,
        dailyVolume,
        period: {
          startDate: startDate || "All time",
          endDate: endDate || "Now",
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật kho hàng bulk (cho trường hợp nhập nhiều sản phẩm cùng lúc)
exports.bulkUpdateInventory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { updates, staffId, note } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Danh sách cập nhật không hợp lệ",
      });
    }

    const results = [];

    for (const update of updates) {
      const {
        productId,
        sku,
        quantity,
        type = "in",
        reason = "restock",
        priceChange,
      } = update;

      // Get product
      const product = await Product.findById(productId).session(session);
      if (!product) continue;

      let beforeStock, afterStock;

      // Handle variants
      if (product.hasVariants && sku) {
        const variantIndex = product.variants.findIndex((v) => v.sku === sku);
        if (variantIndex === -1) continue;

        beforeStock = product.variants[variantIndex].stock;
        afterStock =
          type === "in" ? beforeStock + quantity : beforeStock - quantity;

        if (afterStock < 0) continue; // Skip invalid updates

        product.variants[variantIndex].stock = afterStock;
        if (priceChange?.newPrice) {
          product.variants[variantIndex].price = priceChange.newPrice;
        }
      } else {
        beforeStock = product.countInStock;
        afterStock =
          type === "in" ? beforeStock + quantity : beforeStock - quantity;

        if (afterStock < 0) continue;

        product.countInStock = afterStock;
        if (priceChange?.newPrice) {
          product.price = priceChange.newPrice;
        }
      }

      await product.save({ session });

      // Create transaction record
      const transaction = new InventoryTransaction({
        productId,
        type,
        sku,
        quantity: type === "in" ? quantity : -quantity,
        beforeStock,
        afterStock,
        priceChange: priceChange || null,
        reason,
        note: note || `Bulk update - ${product.name}`,
        staffId,
      });

      await transaction.save({ session });
      results.push(transaction);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Cập nhật thành công ${results.length} sản phẩm`,
      data: results,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy trạng thái tồn kho hiện tại
exports.getCurrentStocks = async (req, res) => {
  try {
    const { productIds, lowStockThreshold = 10 } = req.query;

    let filter = {};
    if (productIds) {
      const ids = Array.isArray(productIds)
        ? productIds
        : productIds.split(",");
      filter._id = { $in: ids };
    }

    const products = await Product.find(filter)
      .select(
        "name image price countInStock variants hasVariants brandId categoryId"
      )
      .populate("brandId", "name")
      .populate("categoryId", "name");

    const stockInfo = products.map((product) => {
      const baseInfo = {
        _id: product._id,
        name: product.name,
        image: product.image,
        brand: product.brandId?.name,
        category: product.categoryId?.name,
        hasVariants: product.hasVariants,
      };

      if (product.hasVariants) {
        const variants = product.variants.map((variant) => ({
          sku: variant.sku,
          attributes: variant.attributes,
          stock: variant.stock,
          price: variant.price,
          sold: variant.sold || 0,
          status:
            variant.stock === 0
              ? "out"
              : variant.stock <= lowStockThreshold
              ? "low"
              : "good",
        }));

        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
        const isOutOfStock = variants.every((v) => v.stock === 0);
        const hasLowStock = variants.some(
          (v) => v.stock > 0 && v.stock <= lowStockThreshold
        );

        return {
          ...baseInfo,
          variants,
          totalStock,
          status: isOutOfStock ? "out" : hasLowStock ? "low" : "good",
        };
      } else {
        return {
          ...baseInfo,
          stock: product.countInStock,
          price: product.price,
          sold: product.sold || 0,
          status:
            product.countInStock === 0
              ? "out"
              : product.countInStock <= lowStockThreshold
              ? "low"
              : "good",
        };
      }
    });

    // Group by status
    const summary = {
      total: stockInfo.length,
      good: stockInfo.filter((p) => p.status === "good").length,
      low: stockInfo.filter((p) => p.status === "low").length,
      out: stockInfo.filter((p) => p.status === "out").length,
    };

    res.status(200).json({
      success: true,
      data: stockInfo,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
