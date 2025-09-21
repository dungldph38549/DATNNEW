const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
  },
  workHours: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["present", "late", "absent", "half-day"],
    default: "present",
  },
  notes: {
    type: String,
    trim: true,
  },
});

const salaryHistorySchema = new mongoose.Schema({
  effectiveDate: {
    type: Date,
    required: true,
  },
  oldSalary: {
    type: Number,
    required: true,
  },
  newSalary: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },

    // Role and permissions
    role: {
      type: String,
      enum: ["customer", "staff", "manager", "admin"],
      default: "customer",
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Staff specific fields
    employeeId: {
      type: String,
      unique: true,
      sparse: true, // Only for staff members
      index: true,
    },
    position: {
      type: String,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      enum: [
        "sales",
        "warehouse",
        "customer-service",
        "marketing",
        "admin",
        "management",
      ],
      index: true,
    },
    salary: {
      type: Number,
      min: [0, "Lương không được âm"],
    },
    startDate: {
      type: Date,
      index: true,
    },
    endDate: {
      type: Date,
    },

    // Manager/Supervisor
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Work schedule
    workSchedule: {
      monday: { start: String, end: String, isWorkDay: Boolean },
      tuesday: { start: String, end: String, isWorkDay: Boolean },
      wednesday: { start: String, end: String, isWorkDay: Boolean },
      thursday: { start: String, end: String, isWorkDay: Boolean },
      friday: { start: String, end: String, isWorkDay: Boolean },
      saturday: { start: String, end: String, isWorkDay: Boolean },
      sunday: { start: String, end: String, isWorkDay: Boolean },
    },

    // Emergency contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Documents
    documents: [
      {
        type: {
          type: String,
          enum: ["contract", "id", "passport", "certificate", "other"],
        },
        filename: String,
        url: String,
        uploadDate: { type: Date, default: Date.now },
      },
    ],

    // Performance and attendance
    attendance: [attendanceSchema],
    salaryHistory: [salaryHistorySchema],

    // Notes and remarks
    notes: {
      type: String,
      trim: true,
    },

    // Permissions
    permissions: [
      {
        type: String,
        enum: [
          "view_orders",
          "manage_orders",
          "view_products",
          "manage_products",
          "view_customers",
          "manage_customers",
          "view_reports",
          "manage_reports",
          "view_inventory",
          "manage_inventory",
          "view_staff",
          "manage_staff",
        ],
      },
    ],

    // Login tracking
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },

    // Account status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ department: 1, position: 1 });
userSchema.index({ "attendance.date": -1 });

// Virtual fields
userSchema.virtual("fullName").get(function () {
  return this.name;
});

userSchema.virtual("isStaff").get(function () {
  return ["staff", "manager", "admin"].includes(this.role);
});

userSchema.virtual("currentMonthAttendance").get(function () {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return this.attendance.filter(
    (att) => att.date >= startOfMonth && att.date <= endOfMonth
  );
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
  // Hash password if modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Generate employee ID for staff
  if (this.isStaff && !this.employeeId) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.constructor.countDocuments({
      role: { $in: ["staff", "manager", "admin"] },
    });
    this.employeeId = `PSG${year}${(count + 1).toString().padStart(4, "0")}`;
  }

  next();
});

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.recordAttendance = function (
  checkIn,
  checkOut = null,
  status = "present",
  notes = ""
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if attendance already exists for today
  const existingAttendance = this.attendance.find(
    (att) => att.date.toDateString() === today.toDateString()
  );

  if (existingAttendance) {
    if (checkOut) {
      existingAttendance.checkOut = checkOut;
      existingAttendance.workHours =
        (checkOut - existingAttendance.checkIn) / (1000 * 60 * 60);
    }
    existingAttendance.status = status;
    existingAttendance.notes = notes;
  } else {
    this.attendance.push({
      date: today,
      checkIn,
      checkOut,
      workHours: checkOut ? (checkOut - checkIn) / (1000 * 60 * 60) : 0,
      status,
      notes,
    });
  }

  return this.save();
};

userSchema.methods.updateSalary = function (newSalary, reason, approvedBy) {
  this.salaryHistory.push({
    effectiveDate: new Date(),
    oldSalary: this.salary || 0,
    newSalary,
    reason,
    approvedBy,
  });

  this.salary = newSalary;
  return this.save();
};

// Static methods
userSchema.statics.findStaff = function (filters = {}) {
  return this.find({
    role: { $in: ["staff", "manager", "admin"] },
    deletedAt: null,
    ...filters,
  });
};

userSchema.statics.findByDepartment = function (department) {
  return this.find({
    department,
    role: { $in: ["staff", "manager", "admin"] },
    deletedAt: null,
    isActive: true,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
