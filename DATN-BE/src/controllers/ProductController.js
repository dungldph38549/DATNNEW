const Product = require("../models/ProductModel.js");
const ProductService = require("../services/ProductSevice");
const { successResponse, errorResponse } = require("../utils/response.js");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
    } = req.body;
    if (!name || !image) {
      return res.status(422).json({ message: "Điền đầy đủ các trường yêu cầu" });
    }
    const newProduct = await ProductService.createProduct(req.body);
    successResponse({ res, data: newProduct, statusCode: 201 });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const products = await ProductService.getProducts(
      Number(limit) || 10,
      Number(page) || 0,
      sort,
      filter
    );
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { limit, page, filter } = req.query;
    const products = await ProductService.getAllProducts(Number(limit) || 10, Number(page) || 0, filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }

    const product = await ProductService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }
    const deleted = await ProductService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }
    const deleted = await ProductService.restoreProductById(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await ProductService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await ProductService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
