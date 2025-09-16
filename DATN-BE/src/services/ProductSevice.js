// src/services/ProductService.js
const Product = require("../models/ProductModel");
<<<<<<< HEAD
const Brand = require('../models/Brands');
const Category = require('../models/Categories');
=======
const Brand = require("../models/Brands");
const Category = require("../models/Categories");
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7

const createProduct = async (data) => {
  const {
    name,
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
<<<<<<< HEAD

=======
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7
    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) throw new Error({ message: "Brand không tồn tại" });
    }

    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists)
        throw new Error({ message: "Category không tồn tại" });
    }

    const product = new Product({
      name,
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

const getAllProducts = (limit = 10, page = 0, filter, isListProductRemoved) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};

      if (isListProductRemoved == 1) {
        query.deletedAt = { $ne: null };
      } else {
<<<<<<< HEAD
        query.$or = [
          { deletedAt: { $exists: false } },
          { deletedAt: null }
        ];
=======
        query.$or = [{ deletedAt: { $exists: false } }, { deletedAt: null }];
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7
      }
      const filters = JSON.parse(filter);
      if (filters.name) {
        query.name = { $regex: filters.name, $options: "i" };
      }
<<<<<<< HEAD

      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }

      if (filters.brandId) {
        query.brandId = filters.brandId;
      }

      if (filters.priceFrom || filters.priceTo) {
        query.price = {};
        if (filters.priceFrom) query.price.$gte = filters.priceFrom;
        if (filters.priceTo) query.price.$lte = filters.priceTo;
      }

      const totalProduct = await Product.countDocuments(query);

      const allProduct = await Product.find(query)
        .populate('brandId')
        .populate('categoryId')
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1 });
=======
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7

      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }

<<<<<<< HEAD
const relationProduct = async (categoryId, brandId, id) => {
  try {

    const relationProducts = await Product.find({
      $or: [
        { categoryId },
        { brandId }
      ],
      _id: { $ne: id }
    }).sort({ createdAt: -1 }).limit(20);
    return relationProducts;
  } catch (e) {
    throw new Error(e.message);
  }
}
const getProducts = (limit = 20, page = 0, filter = {}, sort = 'createdAt') => {
  return new Promise(async (resolve, reject) => {
    try {
      let sortOption = {};
      if (sort === 'createdAt') {
        sortOption = { createdAt: -1 };
      } else if (sort === 'sold') {
        sortOption = { totalSold: -1 };
      } else if (sort === 'priceDecre') {
        sortOption = { minPrice: -1 };
      } else if (sort === 'priceIncre') {
        sortOption = { minPrice: 1 };
      }

      if (filter.keyword) {
        filter.name = { $regex: filter.keyword, $options: "i" };
        delete filter.keyword;
      }

      const matchCondition = {
        deletedAt: null,
        ...filter,
      };

      const result = await Product.aggregate([
        { $match: matchCondition },

        {
          $addFields: {
            minPrice: {
              $cond: {
                if: "$hasVariants",
                then: { $min: "$variants.price" },
                else: "$price",
              },
            },
            totalSold: {
              $cond: {
                if: "$hasVariants",
                then: { $sum: "$variants.sold" },
                else: "$sold",
              },
            },
          },
        },

        {
          $facet: {
            data: [
              { $sort: sortOption },
              { $skip: page * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'brands',
                  localField: 'brandId',
                  foreignField: '_id',
                  as: 'brandId',
                },
              },
              { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: 'categories',
                  localField: 'categoryId',
                  foreignField: '_id',
                  as: 'categoryId',
                },
              },
              { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true } },
            ],
            totalCount: [
              { $count: "total" }
            ]
          }
        }
      ]);

      const allProduct = result[0]?.data || [];
      const totalProduct = result[0]?.totalCount?.[0]?.total || 0;

=======
      if (filters.brandId) {
        query.brandId = filters.brandId;
      }

      if (filters.priceFrom || filters.priceTo) {
        query.price = {};
        if (filters.priceFrom) query.price.$gte = filters.priceFrom;
        if (filters.priceTo) query.price.$lte = filters.priceTo;
      }

      const totalProduct = await Product.countDocuments(query);

      const allProduct = await Product.find(query)
        .populate("brandId")
        .populate("categoryId")
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1 });

>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7
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

const relationProduct = async (categoryId, brandId, id) => {
  try {
    const relationProducts = await Product.find({
      $or: [{ categoryId }, { brandId }],
      _id: { $ne: id },
    })
      .sort({ createdAt: -1 })
      .limit(20);
    return relationProducts;
  } catch (e) {
    throw new Error(e.message);
  }
};
const getProducts = (limit = 20, page = 0, filter = {}, sort = "createdAt") => {
  return new Promise(async (resolve, reject) => {
    try {
      let sortOption = {};
      if (sort === "createdAt") {
        sortOption = { createdAt: -1 };
      } else if (sort === "sold") {
        sortOption = { totalSold: -1 };
      } else if (sort === "priceDecre") {
        sortOption = { minPrice: -1 };
      } else if (sort === "priceIncre") {
        sortOption = { minPrice: 1 };
      }

      if (filter.keyword) {
        filter.name = { $regex: filter.keyword, $options: "i" };
        delete filter.keyword;
      }

      const matchCondition = {
        deletedAt: null,
        ...filter,
      };

      const result = await Product.aggregate([
        { $match: matchCondition },

        {
          $addFields: {
            minPrice: {
              $cond: {
                if: "$hasVariants",
                then: { $min: "$variants.price" },
                else: "$price",
              },
            },
            totalSold: {
              $cond: {
                if: "$hasVariants",
                then: { $sum: "$variants.sold" },
                else: "$sold",
              },
            },
          },
        },

        {
          $facet: {
            data: [
              { $sort: sortOption },
              { $skip: page * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: "brands",
                  localField: "brandId",
                  foreignField: "_id",
                  as: "brandId",
                },
              },
              {
                $unwind: { path: "$brandId", preserveNullAndEmptyArrays: true },
              },
              {
                $lookup: {
                  from: "categories",
                  localField: "categoryId",
                  foreignField: "_id",
                  as: "categoryId",
                },
              },
              {
                $unwind: {
                  path: "$categoryId",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            totalCount: [{ $count: "total" }],
          },
        },
      ]);

      const allProduct = result[0]?.data || [];
      const totalProduct = result[0]?.totalCount?.[0]?.total || 0;

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
  const product = await Product.findById(id)
<<<<<<< HEAD
    .populate('brandId')
    .populate('categoryId');
=======
    .populate("brandId")
    .populate("categoryId");
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (productId, data) => {
  const {
    name,
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
    await Product.findByIdAndUpdate(id, { deletedAt: null });
    return true;
  } catch (error) {
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
<<<<<<< HEAD
  relationProduct
};
=======

  relationProduct,
};
>>>>>>> b1738c5eb5d1946541b9889b03e17dda988c07e7
