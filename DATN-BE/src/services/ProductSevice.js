// src/services/ProductService.js
const Product = require("../models/ProductModel");

const createProduct = async (data) => {
  if (!data.name || !data.price || !data.image) {
    throw new Error("Missing required fields: name, price, image");
  }
  const nameExists = await Product.findOne({ name: data.name });
  if (nameExists) {
    throw new Error("Product name already exists");
  }

  return await Product.create(data);
};

const getAllProducts = (limit = 10, page = 0, sort = "asc") => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      const allProduct = await Product.find()
        .limit(limit)
        .skip((page) * limit)

      resolve({
        status: "ok",
        message: "Successfully fetched all products",
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getProducts = (limit = 2, page = 0, sort = "asc") => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      // Chuyển sort thành số: 1 (asc) hoặc -1 (desc)
      const sortValue = sort === "desc" ? -1 : 1;

      const allProduct = await Product.find({
          deletedAt: null
        })
        .limit(limit)
        .skip(page * limit)
        .sort({ name: sortValue });

      resolve({
        status: "ok",
        message: "Successfully fetched all products",
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};


const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Cannot update. Product not found");
  }

  if (data.name && data.name !== product.name) {
    const nameExists = await Product.findOne({ name: data.name });
    if (nameExists) {
      throw new Error("Product name already exists");
    }
  }

  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm.");
  }
  product.deletedAt = Date.now();
  product.save();
  return product;
};

const restoreProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm.");
    }

    product.deletedAt = null;
    await product.save();
    return product;
  } catch (error) {
    console.error("Lỗi khi khôi phục sản phẩm:", error.message);
    throw new Error("Khôi phục sản phẩm thất bại.");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  restoreProductById,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
