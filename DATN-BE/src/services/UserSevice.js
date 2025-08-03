const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAcessToken } = require("./JwtSevice");

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
        .skip((page) * limit)
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
      const comfirmPassword = bcrypt.compareSync(password, checkUser.password);

      if (!comfirmPassword) {
        return reject({
          status: false,
          message: "Email hoặc mật khẩu không chính xác",
        });
      }
      const acess_token = await genneralAcessToken({
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
        acess_token,
        refresh_token,
        data: {
          _id: checkUser._id,
          name: checkUser.name,
          email: checkUser.email,
          phone: checkUser.phone,
          isAdmin: checkUser.isAdmin,
        },
      });
    } catch (e) {
      return reject(e.message);
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

    const update = {  }
    if(data.password) {
      const hash = await bcrypt.hashSync(password, 10);
      update.password = hash
    } 
    update.isAdmin = data.isAdmin
    
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
        message: "User not found",
      };
    }

    await User.findByIdAndDelete(id);

    return {
      status: true,
      message: "Delete successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: "Something went wrong",
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
        message: "Get all user successfully",
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
