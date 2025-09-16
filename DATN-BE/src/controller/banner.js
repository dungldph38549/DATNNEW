import Banner from '../models/banner.js';

export const create = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// import Banner from '../models/banner.js';

// export const create = async (req, res) => {
//   try {
//     const banner = await Banner.create(req.body);
//     res.json(banner);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getAll = async (req, res) => {
//   try {
//     const banners = await Banner.find();
//     res.json(banners);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const update = async (req, res) => {
//   try {
//     const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(banner);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const remove = async (req, res) => {
//   try {
//     await Banner.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
