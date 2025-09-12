const UserService = require("../services/UserSevice");

const createUser = async (req, res) => {
  try {
    const { name, email, password, comfirmPassword, phone } = req.body;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCheckEmail = reg.test(email);
    
    if (!name || !email || !password || !comfirmPassword || !phone || !isCheckEmail) {
      return res.status(422).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    if (password !== comfirmPassword) {
      return res.status(422).json({
        status: false,
        message: "Mật khẩu và xác nhận mật khẩu không khớp",
      });
    }

    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json(e);
  }
};

const listUser = async (req, res) => {
  try {
    const {page, limit} = req.query
    const response = await UserService.listUser(Number(page), Number(limit));
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json(e);
  }
};

const loginUser = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !isCheckEmail) {
      return res.status(422).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    } 

    const response = await UserService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json(e);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(422).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      return res.status(422).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    const userInfor = {};
    if(data.name) userInfor.name = data.fullName
    if(data.email) userInfor.email = data.email
    if(data.phone) userInfor.phone = data.phone
    if(data.address) userInfor.address = data.address 
    if(data.password) userInfor.password = data.password
    if(data.avatar) userInfor.avatar = data.avatar
    const response = await UserService.updateUser(data.id, userInfor);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
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
  listUser,
  updateCustomer
};
