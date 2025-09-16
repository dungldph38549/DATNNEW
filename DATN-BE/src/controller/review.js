import Review from '../models/review.js';

export const create = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter).populate('productId userId');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// import Review from '../models/review.js';

// export const create = async (req, res) => {
//   try {
//     const review = await Review.create(req.body);
//     res.json(review);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getAll = async (req, res) => {
//   try {
//     const { productId } = req.query;
//     const filter = productId ? { productId } : {};
//     const reviews = await Review.find(filter).populate('productId userId');
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const update = async (req, res) => {
//   try {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(review);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const remove = async (req, res) => {
//   try {
//     await Review.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };