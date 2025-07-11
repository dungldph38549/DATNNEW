const ProductService = require("../services/ProductSevice");

exports.createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;

    // Kiểm tra trường bắt buộc
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const products = await ProductService.getAllProducts(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await ProductService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updated = await ProductService.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
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
