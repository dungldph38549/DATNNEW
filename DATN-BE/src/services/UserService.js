const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAcessToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser) {
        return reject({
          status: "false",
          message: "Email đang được sử dụng",
        });
      }
      const hash = await bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        isAdmin: false,
        phone,
      });
      if (createdUser) {
        return resolve({
          status: true,
          message: "Tạo tài khoản thành công",
          data: createdUser,
        });
      }
    } catch (e) {
      return reject(e);
    }
  });
};

const listUser = async (page, limit) => {
  const total = await User.countDocuments();

  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "ok",
        message: "Successfully",
        data: allUser,
        total: total,
        pageCurrent: page + 1,
        totalPage: Math.ceil(total / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });

      // Kiểm tra user có tồn tại không
      if (!checkUser) {
        return reject({
          status: false,
          message: "Email hoặc mật khẩu không chính xác",
        });
      }

      const confirmPassword = bcrypt.compareSync(password, checkUser.password);

      if (!confirmPassword) {
        return reject({
          status: false,
          message: "Email hoặc mật khẩu không chính xác",
        });
      }

      const access_token = await genneralAcessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralAcessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      return resolve({
        status: true,
        message: "Đăng nhập thành công",
        access_token,
        refresh_token,
        data: {
          _id: checkUser._id,
          name: checkUser.name,
          email: checkUser.email,
          phone: checkUser.phone,
          isAdmin: checkUser.isAdmin,
          address: checkUser.address,
          avatar: checkUser.avatar,
        },
      });
    } catch (e) {
      return reject({
        status: false,
        message: e.message || "Lỗi đăng nhập",
      });
    }
  });
};

const updateUser = async (id, data) => {
  try {
    const checkUser = await User.findById(id);
    if (!checkUser) {
      return {
        status: false,
        message: "Không tìm thấy người dùng",
      };
    }

    const update = {};
    if (data.password) {
      const hash = await bcrypt.hashSync(data.password, 10);
      update.password = hash;
    }
    if (data.isAdmin !== undefined) update.isAdmin = data.isAdmin;

    if (data.name) update.name = data.name;
    if (data.email) update.email = data.email;
    if (data.phone) update.phone = data.phone;
    if (data.address) update.address = data.address;
    if (data.avatar) update.avatar = data.avatar;

    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });

    return {
      status: true,
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteUser = async (id) => {
  try {
    const checkUser = await User.findById(id);

    if (!checkUser) {
      return {
        status: false,
        message: "Không tìm thấy người dùng",
      };
    }

    await User.findByIdAndDelete(id);

    return {
      status: true,
      message: "Xóa người dùng thành công",
    };
  } catch (e) {
    return {
      status: false,
      message: "Có lỗi xảy ra khi xóa người dùng",
      error: e.message,
    };
  }
};

const getAllUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: true,
        message: "Lấy danh sách người dùng thành công",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  listUser,
};
