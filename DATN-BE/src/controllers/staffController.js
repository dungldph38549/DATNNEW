const User = require("../models/UserModel");
const { validationResult } = require("express-validator");

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      department,
      status,
      search,
    } = req.query;

    let filter = {
      role: { $in: ["staff", "manager", "admin"] },
      deletedAt: null,
    };

    // Apply filters
    if (role && role !== "all") {
      if (role === "admin") {
        filter.$or = [{ isAdmin: true }, { role: "admin" }];
      } else {
        filter.role = role;
      }
    }

    if (department) {
      filter.department = department;
    }

    if (status && status !== "all") {
      filter.isActive = status === "active";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const staff = await User.find(filter)
      .select("-password")
      .populate("managerId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: staff,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id)
      .select("-password")
      .populate("managerId", "name email position")
      .populate("salaryHistory.approvedBy", "name");

    if (!staff || !staff.isStaff) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại",
      });
    }

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const staffData = {
      ...req.body,
      role: req.body.role || "staff",
    };

    // Check if email already exists
    const existingUser = await User.findOne({ email: staffData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại trong hệ thống",
      });
    }

    const staff = new User(staffData);
    await staff.save();

    // Remove password from response
    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.status(201).json({
      success: true,
      data: staffResponse,
      message: "Tạo nhân viên thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Don't allow password updates through this endpoint

    const staff = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại",
      });
    }

    res.json({
      success: true,
      data: staff,
      message: "Cập nhật nhân viên thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Soft delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      {
        deletedAt: new Date(),
        deletedBy: req.user.id,
        isActive: false,
      },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Xóa nhân viên thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Record attendance
exports.recordAttendance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { checkIn, checkOut, status, notes } = req.body;

    const staff = await User.findById(staffId);
    if (!staff || !staff.isStaff) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại",
      });
    }

    await staff.recordAttendance(
      new Date(checkIn),
      checkOut ? new Date(checkOut) : null,
      status,
      notes
    );

    res.json({
      success: true,
      message: "Ghi nhận chấm công thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update salary
exports.updateSalary = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { newSalary, reason } = req.body;

    const staff = await User.findById(staffId);
    if (!staff || !staff.isStaff) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại",
      });
    }

    await staff.updateSalary(newSalary, reason, req.user.id);

    res.json({
      success: true,
      message: "Cập nhật lương thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get staff statistics
exports.getStaffStats = async (req, res) => {
  try {
    const totalStaff = await User.countDocuments({
      role: { $in: ["staff", "manager", "admin"] },
      deletedAt: null,
    });

    const activeStaff = await User.countDocuments({
      role: { $in: ["staff", "manager", "admin"] },
      deletedAt: null,
      isActive: true,
    });

    const departmentStats = await User.aggregate([
      {
        $match: {
          role: { $in: ["staff", "manager", "admin"] },
          deletedAt: null,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    const roleStats = await User.aggregate([
      {
        $match: {
          role: { $in: ["staff", "manager", "admin"] },
          deletedAt: null,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalStaff,
        activeStaff,
        inactiveStaff: totalStaff - activeStaff,
        departmentStats,
        roleStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
