// src/services/ProductService.js
const Product = require("../models/ProductModel");
const Brand = require('../models/Brands');
const Category = require('../models/Categories'); 

const createProduct = async (data) => {
  const {
      name,
      sortDescription,
      image,
      srcImages = [],
      type,
      price,
      countInStock,
      rating,
      description,
      hasVariants = false,
      attributes = [],
      variants = [],
      brandId,
      categoryId,
    } = data;
  try {
 
    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) throw new Error({ message: 'Brand không tồn tại' });
    }

    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new Error({ message: 'Category không tồn tại' });
    }

    const product = new Product({
      name,
      sortDescription,
      image,
      srcImages,
      type,
      price,
      countInStock,
      rating,
      description,
      hasVariants,
      attributes,
      brandId,
      categoryId,
      variants,
    });

    await product.save();
    return product;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getAllProducts = (limit = 10, page = 0, sort = "asc") => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      const allProduct = await Product.find()
        .populate('brandId')
        .populate('categoryId')
        .limit(limit)
        .skip((page) * limit)

      return resolve({
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

const getProducts = (limit = 20, page = 0, sort = "asc") => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      // Chuyển sort thành số: 1 (asc) hoặc -1 (desc)
      const sortValue = sort === "desc" ? -1 : 1;

      const allProduct = await Product.find({
          deletedAt: null
        })
        .populate('brandId')
        .populate('categoryId')
        .limit(limit)
        .skip(page * limit)
        .sort({ name: sortValue });
        
      return resolve({
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

const updateProduct = async (productId, data) => {
  const {
    name,
    sortDescription,
    image,
    srcImages = [],
    type,
    price,
    countInStock,
    rating,
    description,
    hasVariants = false,
    attributes = [],
    variants = [],
    brandId,
    categoryId,
  } = data;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại.");
    }

    // ✅ Kiểm tra brand và category
    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) throw new Error("Brand không tồn tại.");
    }

    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new Error("Category không tồn tại.");
    }

    // ✅ Cập nhật các field
    product.name = name ?? product.name;
    product.sortDescription = sortDescription ?? product.sortDescription;
    product.image = image ?? product.image;
    product.srcImages = srcImages ?? product.srcImages;
    product.type = type ?? product.type;
    product.price = price ?? product.price;
    product.countInStock = countInStock ?? product.countInStock;
    product.rating = rating ?? product.rating;
    product.description = description ?? product.description;
    product.hasVariants = hasVariants;
    product.attributes = attributes;
    product.variants = variants;
    product.brandId = brandId ?? product.brandId;
    product.categoryId = categoryId ?? product.categoryId;

    await product.save();
    return product;
  } catch (err) {
    throw new Error(err.message || "Cập nhật sản phẩm thất bại.");
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    await Product.findByIdAndUpdate(id, { deletedAt: Date.now() });
    // await product.save();
    // return product;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
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
