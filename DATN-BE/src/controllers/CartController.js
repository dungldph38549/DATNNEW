const Cart = require("../models/cart.js");
const Product = require("../models/ProductModel.js");
const mongoose = require("mongoose");

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, guestId, productId, sku, quantity = 1 } = req.body;

    // Validate user
    if (!userId && !guestId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    if (!productId || quantity <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ message: "Thông tin sản phẩm không hợp lệ" });
    }

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let price, availableStock;
    let attributes = {};

    // Kiểm tra variant nếu có
    if (product.hasVariants) {
      if (!sku) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(422)
          .json({ message: "Thiếu thông tin SKU cho sản phẩm có biến thể" });
      }

      const variant = product.variants.find((v) => v.sku === sku);
      if (!variant) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: "Không tìm thấy biến thể sản phẩm" });
      }

      price = variant.price;
      availableStock = variant.stock;
      attributes = Object.fromEntries(variant.attributes);
    } else {
      price = product.price;
      availableStock = product.countInStock;
    }

    // Kiểm tra tồn kho
    if (quantity > availableStock) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Sản phẩm chỉ còn ${availableStock} trong kho`,
      });
    }

    // Tìm giỏ hàng của user
    const query = userId ? { userId } : { guestId };
    let cart = await Cart.findOne(query).session(session);

    if (!cart) {
      // Tạo giỏ hàng mới
      cart = new Cart({
        userId,
        guestId,
        items: [
          {
            productId,
            sku,
            quantity,
            price,
            attributes,
          },
        ],
      });
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          (sku ? item.sku === sku : !item.sku)
      );

      if (existingItemIndex > -1) {
        // Cập nhật số lượng
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (newQuantity > availableStock) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Tổng số lượng vượt quá tồn kho (${availableStock})`,
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].price = price; // Cập nhật giá mới nhất
      } else {
        // Thêm sản phẩm mới
        cart.items.push({
          productId,
          sku,
          quantity,
          price,
          attributes,
        });
      }
    }

    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Populate thông tin sản phẩm để trả về
    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId")
      .populate("userId");

    res.status(200).json({
      status: "ok",
      message: "Đã thêm vào giỏ hàng",
      data: populatedCart,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    if (!userId && !guestId) {
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query)
      .populate("items.productId")
      .populate("userId");

    if (!cart) {
      return res.status(200).json({
        status: "ok",
        message: "Giỏ hàng trống",
        data: { items: [], totalAmount: 0 },
      });
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const validItems = [];

    for (const item of cart.items) {
      if (item.productId) {
        const product = item.productId;
        let isAvailable = true;
        let currentStock = 0;

        // Kiểm tra tồn kho hiện tại
        if (product.hasVariants && item.sku) {
          const variant = product.variants.find((v) => v.sku === item.sku);
          if (variant && variant.stock > 0) {
            currentStock = variant.stock;
          } else {
            isAvailable = false;
          }
        } else {
          currentStock = product.countInStock;
          if (currentStock <= 0) {
            isAvailable = false;
          }
        }

        // Cập nhật số lượng nếu vượt quá tồn kho
        let adjustedQuantity = item.quantity;
        if (item.quantity > currentStock) {
          adjustedQuantity = currentStock;
        }

        validItems.push({
          ...item.toObject(),
          adjustedQuantity,
          isAvailable,
          currentStock,
        });

        if (isAvailable && adjustedQuantity > 0) {
          totalAmount += item.price * adjustedQuantity;
        }
      }
    }

    res.status(200).json({
      status: "ok",
      message: "Lấy giỏ hàng thành công",
      data: {
        ...cart.toObject(),
        items: validItems,
        totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItem = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, guestId, productId, sku, quantity } = req.body;

    if (!userId && !guestId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    if (quantity < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Số lượng không hợp lệ" });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query).session(session);

    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (sku ? item.sku === sku : !item.sku)
    );

    if (itemIndex === -1) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    if (quantity === 0) {
      // Xóa sản phẩm khỏi giỏ hàng
      cart.items.splice(itemIndex, 1);
    } else {
      // Kiểm tra tồn kho
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      let availableStock;
      if (product.hasVariants && sku) {
        const variant = product.variants.find((v) => v.sku === sku);
        if (!variant) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ message: "Biến thể không tồn tại" });
        }
        availableStock = variant.stock;
      } else {
        availableStock = product.countInStock;
      }

      if (quantity > availableStock) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Sản phẩm chỉ còn ${availableStock} trong kho`,
        });
      }

      // Cập nhật số lượng
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Trả về giỏ hàng đã cập nhật
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.productId")
      .populate("userId");

    res.status(200).json({
      status: "ok",
      message: "Cập nhật giỏ hàng thành công",
      data: updatedCart,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, guestId, productId, sku } = req.body;

    if (!userId && !guestId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query).session(session);

    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          (sku ? item.sku === sku : !item.sku)
        )
    );

    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const { userId, guestId } = req.body;

    if (!userId && !guestId) {
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    const query = userId ? { userId } : { guestId };
    await Cart.findOneAndDelete(query);

    res.status(200).json({
      status: "ok",
      message: "Đã xóa toàn bộ giỏ hàng",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Merge giỏ hàng khi user login (từ guest cart sang user cart)
exports.mergeCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, guestId } = req.body;

    if (!userId || !guestId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    // Tìm giỏ hàng của guest và user
    const [guestCart, userCart] = await Promise.all([
      Cart.findOne({ guestId }).session(session),
      Cart.findOne({ userId }).session(session),
    ]);

    if (!guestCart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        status: "ok",
        message: "Không có giỏ hàng guest để merge",
      });
    }

    if (!userCart) {
      // Chuyển guest cart thành user cart
      guestCart.userId = userId;
      guestCart.guestId = undefined;
      await guestCart.save({ session });
    } else {
      // Merge items từ guest cart vào user cart
      for (const guestItem of guestCart.items) {
        const existingItemIndex = userCart.items.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            (guestItem.sku ? item.sku === guestItem.sku : !item.sku)
        );

        if (existingItemIndex > -1) {
          // Cộng dồn số lượng (cần kiểm tra tồn kho)
          const product = await Product.findById(guestItem.productId).session(
            session
          );
          if (product) {
            let maxStock;
            if (product.hasVariants && guestItem.sku) {
              const variant = product.variants.find(
                (v) => v.sku === guestItem.sku
              );
              maxStock = variant ? variant.stock : 0;
            } else {
              maxStock = product.countInStock;
            }

            const newQuantity = Math.min(
              userCart.items[existingItemIndex].quantity + guestItem.quantity,
              maxStock
            );

            userCart.items[existingItemIndex].quantity = newQuantity;
          }
        } else {
          // Thêm item mới
          userCart.items.push(guestItem);
        }
      }

      await userCart.save({ session });
      await Cart.findOneAndDelete({ guestId }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Đã merge giỏ hàng thành công",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
