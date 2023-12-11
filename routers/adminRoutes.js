const express = require("express");
const {
  addAdmin,
  login,
  getAdmin,
  getMe,
  getAdmins,
  updateMe,
  updateUser,
  deleteAdmin,
  changeMyPwd,
  changeUserPwd,
  verifyAdmin,
} = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const router = express.Router();

// api/admins
router.get("/", adminAuth(['super']), getAdmins);

// api/admins/get-me
router.get("/get-me", adminAuth(['super', , 'regular']), getMe);

// api/admins/64b825c06035239557010e1e
router.get("/:id", adminAuth(['super']), getAdmin);

// api/admins/add
router.post("/add", adminAuth(['super']), addAdmin);

// PUBLIC --- /api/admins/login
router.post("/login", login);

// api/admins/update-me
router.patch("/update-me", adminAuth(['super', 'regular']), updateMe);

// api/admins/update-user
router.patch("/update-user/:id", adminAuth(['super']), updateUser);

// api/admins/change-pwd
router.patch("/change-my-pwd", adminAuth(['super', 'regular']), changeMyPwd);

router.patch("/change-user-pwd/:id", adminAuth(['super']), changeUserPwd);

// api/admins/64b825c06035239557010e1e
router.delete("/:id", adminAuth(['super']), deleteAdmin);

//Public --- /api/admins/verify
router.post('/verify', verifyAdmin)

module.exports = router;