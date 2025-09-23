// controllers/StaffController.js - Quản lý nhân viên dựa trên User model hiện có
const { default: mongoose } = require("mongoose");
const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

// Lấy tất cả nhân viên (exclude customers)
const getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1000,
      search,
      role,
      status,
      department,
      position,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query - exclude customers
    let query = {
      $or: [
        { role: { $exists: false } }, // User cũ không có role
        { role: { $ne: "customer" } }, // Exclude customers
        { isAdmin: true }, // Include all admins
      ],
    };

    // Search filter
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Role filter
    if (role && role !== "all") {
      query.$and = query.$and || [];
      if (role === "admin") {
        query.$and.push({ isAdmin: true });
      } else if (role === "manager") {
        query.$and.push({ role: "manager" });
      } else if (role === "staff") {
        query.$and.push({
          $and: [
            { $or: [{ isAdmin: false }, { isAdmin: { $exists: false } }] },
            {
              $or: [{ role: { $ne: "manager" } }, { role: { $exists: false } }],
            },
          ],
        });
      }
    }

    // Status filter
    if (status && status !== "all") {
      if (status === "active") {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [{ isActive: true }, { isActive: { $exists: false } }],
        });
      } else if (status === "inactive") {
        query.$and = query.$and || [];
        query.$and.push({ isActive: false });
      }
    }

    // Department filter
    if (department && department !== "all") {
      query.department = department;
    }

    // Position filter
    if (position && position !== "all") {
      query.position = position;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password") // Exclude password
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    // Format response to match frontend expectations
    const formattedUsers = users.map((user) => ({
      ...user,
      // Ensure isActive defaults to true if not set
      isActive: user.isActive !== false,
      // Set default role if not exists
      role: user.isAdmin ? "admin" : user.role || "staff",
    }));

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched staff data",
      data: formattedUsers,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Get all staff error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Tạo nhân viên mới
const createStaff = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      phone,
      address,
      role,
      position,
      department,
      salary,
      startDate,
      notes,
      isActive = true,
      password = "123456", // Default password
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Họ tên và email là bắt buộc",
      });
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        status: "error",
        message: "Email đã được sử dụng",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new staff
    const newStaff = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role === "admin" ? "admin" : role || "staff",
      isAdmin: role === "admin",
      position,
      department,
      salary: salary ? parseInt(salary) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      notes,
      isActive,
      avatar: null,
    });

    const savedStaff = await newStaff.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Remove password from response
    const responseData = savedStaff.toObject();
    delete responseData.password;

    res.status(201).json({
      status: "ok",
      message: "Tạo nhân viên thành công",
      data: responseData,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Create staff error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Cập nhật thông tin nhân viên
const updateStaff = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove sensitive fields
    delete updateData._id;
    delete updateData.password;
    delete updateData.__v;

    // Handle role update
    if (updateData.role) {
      updateData.isAdmin = updateData.role === "admin";
      if (updateData.role === "admin") {
        updateData.role = "admin";
      }
    }

    // Handle salary conversion
    if (updateData.salary) {
      updateData.salary = parseInt(updateData.salary);
    }

    // Handle date fields
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }

    // Check if user exists
    const existingUser = await User.findById(id).session(session);
    if (!existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy nhân viên",
      });
    }

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      }).session(session);

      if (emailExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({
          status: "error",
          message: "Email đã được sử dụng",
        });
      }
    }

    // Update user
    const updatedStaff = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
      runValidators: true,
    }).select("-password");

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Cập nhật nhân viên thành công",
      data: updatedStaff,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Update staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Email đã được sử dụng",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Xóa nhân viên (soft delete)
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy nhân viên",
      });
    }

    // Soft delete by setting isActive = false
    const updatedStaff = await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      status: "ok",
      message: "Xóa nhân viên thành công",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Lấy chi tiết nhân viên
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id).select("-password");

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy nhân viên",
      });
    }

    res.status(200).json({
      status: "ok",
      message: "Lấy thông tin nhân viên thành công",
      data: staff,
    });
  } catch (error) {
    console.error("Get staff by id error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Thống kê nhân viên
const getStaffStatistics = async (req, res) => {
  try {
    // Query for staff only (exclude customers)
    const staffQuery = {
      $or: [
        { role: { $exists: false } },
        { role: { $ne: "customer" } },
        { isAdmin: true },
      ],
    };

    const [totalStats] = await Promise.all([
      // Total statistics
      User.aggregate([
        { $match: staffQuery },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$isActive", true] },
                      { $eq: [{ $type: "$isActive" }, "missing"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            inactive: {
              $sum: {
                $cond: [{ $eq: ["$isActive", false] }, 1, 0],
              },
            },
            admins: {
              $sum: {
                $cond: [{ $eq: ["$isAdmin", true] }, 1, 0],
              },
            },
            managers: {
              $sum: {
                $cond: [{ $eq: ["$role", "manager"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const overview = totalStats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      admins: 0,
      managers: 0,
    };

    res.status(200).json({
      status: "ok",
      message: "Lấy thống kê nhân viên thành công",
      data: { overview },
    });
  } catch (error) {
    console.error("Get staff statistics error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById,
  getStaffStatistics,
};
