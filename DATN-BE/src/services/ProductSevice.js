// src/services/ProductService.js
const Product = require("../models/ProductModel");

const createProduct = async (data) => {
  if (!data.name || !data.price || !data.image) {
    throw new Error("Missing required fields: name, price, image");
  }

  const exists = await Product.findOne({ name: data.name });
  if (exists) {
    throw new Error("Product with this name already exists");
  }

  return await Product.create(data);
};

const getAllProducts = async () => await Product.find();

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
    throw new Error("Product not found");
  }

  await product.deleteOne();
  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
