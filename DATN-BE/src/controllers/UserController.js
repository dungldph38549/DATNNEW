const UserService = require("../services/UserSevice");

const createUser = async (req, res) => {
  try {
    const { name, email, password, comfirmPassword, phone } = req.body;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !comfirmPassword || !phone) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else if (password !== comfirmPassword) {
      return res.status(200).json({
        status: false,
        message: "password ko dung vs comfirmPassword",
      });
    }

    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, email, password, comfirmPassword, phone } = req.body;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !comfirmPassword || !phone) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else if (password !== comfirmPassword) {
      return res.status(200).json({
        status: false,
        message: "password ko dung vs comfirmPassword",
      });
    }

    const response = await UserService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: false,
        message: "Please fill in all fields",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
};
