const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/login", UserController.loginUser);
router.post("/register", UserController.createUser);
router.put("/update-user/:id", UserController.updateUser);
router.delete(
  "/delete-user/:id",
  authMiddleware,
  UserController.deleteUser,
  async (req, res) => {
    // chỉ admin mới được xoá user
    res.json({ message: "Admin đã xoá user" });
  }
);
router.get("/getAll", authMiddleware, UserController.getAllUser);

module.exports = router;
