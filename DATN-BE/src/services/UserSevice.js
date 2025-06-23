const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAcessToken } = require("./JwtSevice");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, comfirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser) {
        resolve({
          status: "Ok",
          message: "User already exists",
        });
      }
      const hash = await bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        comfirmPassword: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: true,
          message: "User created successfully",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, comfirmPassword, phone } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "Ok",
          message: "User already exists",
        });
      }
      const comfirmPassword = bcrypt.compareSync(password, checkUser.password);

      if (!comfirmPassword) {
        resolve({
          status: true,
          message: "  the password is incorrect",
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
      console.log("acess_token", acess_token);

      resolve({
        status: true,
        message: "  successfully",
        acess_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = async (id, data) => {
  try {
    const checkUser = await User.findById(id);
    if (!checkUser) {
      return {
        status: false,
        message: "User not found",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    return {
      status: true,
      message: "Update successfully",
      data: updatedUser,
    };
  } catch (e) {
    return {
      status: false,
      message: "Something went wrong",
      error: e.message,
    };
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
};
