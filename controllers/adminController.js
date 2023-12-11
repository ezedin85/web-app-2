const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Admin = require("../models/adminModel");

const createToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });

const addAdmin = async (req, res) => {
  const { name, email, role, password, confirmPwd } = req.body;
  try {
    const admin = await Admin.addAdmin(name, email, role, password, confirmPwd);
    const token = createToken(admin._id);
    res.status(201).json({ name, email, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);
    res.status(201).json({ email, token, role: admin.role, name: admin.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "not a valid id" });
  }
  try {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(400).json({ error: "no admin found by this id!" });
    }
    res.status(200).json(admin);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getMe = async (req, res) => {
  const id = req.userId;
  try {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(400).json({ error: "no admin found by this id!" });
    }
    res.status(200).json(admin);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).sort("-createdAt");
    res.json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "not a valid id" });
  }
  try {
    //if there is only one super admin, that account can't be deleted
    const adminToDelete = await Admin.findById(id);
    if (adminToDelete.role === "super") {
      const count = await Admin.find({ role: "super" }).count();
      if (count === 1) {
        throw Error(
          "This account is the sole Super Admin and is not eligible for deletion."
        );
      }
    }

    //delete the account
    const admin = await Admin.findOneAndDelete({ _id: id });
    if (!admin) {
      return res.status(404).json({ error: "no admin found by this id!" });
    }

    res.json({ admin: admin.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMe = async (req, res) => {
  const id = req.userId;
  const { name, email } = req.body;
  try {

    const admin = await Admin.findOne({ email });
    if (admin && !admin._id.equals(id)) {
      throw Error("email already in use");
    }

    const updatedData = await Admin.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({
      name: updatedData.name,
      email: updatedData.email,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    //handle comon update errors
    await handleCommonUpdateErrors(email, role, id);

    const updatedData = await Admin.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    res.json({
      name: updatedData.name,
      email: updatedData.email,
      role: updatedData.role,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const handleCommonUpdateErrors = async (email, role, id) => {
  //if email is used by another accuont
  const admin = await Admin.findOne({ email });
  if (admin && !admin._id.equals(id)) {
    throw Error("email already in use");
  }

  // Check if the user role is being changed to "regular"
  if (role === "regular") {
    const superAdmins = await Admin.find({ role: "super" });
    // Check if the current account being updated is the only Super Admin
    if (superAdmins.length === 1 && superAdmins[0]._id.equals(id)) {
      // Prevent switching the only Super Admin account to a regular account
      throw Error(
        "As this account is the only Super Admin, it is not possible to switch it to a regular account."
      );
    }
  }
};

const changeMyPwd = async (req, res) => {
  const id = req.userId;

  const { prevPwd, newPwd, confirmPwd } = req.body;
  try {
    if (!prevPwd || !newPwd || !confirmPwd)
      throw Error("Please fill all required Fields");

    const admin = await Admin.findById(id);
    if (!admin) throw Error("Admin not found!");

    const match = await bcrypt.compare(prevPwd, admin.password);
    if (!match) {
      throw Error(
        "The password you entered as a previous password is not correct"
      );
    }

    if (newPwd !== confirmPwd) throw Error("Passwords don't match");

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPwd, salt);

    //update the password
    await Admin.findByIdAndUpdate(
      id,
      { password: hashedPwd },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const changeUserPwd = async (req, res) => {
  const { id } = req.params;
  const { password, confirmPwd } = req.body;
  try {
    if (!password || !confirmPwd)
      throw Error("Please fill all required Fields");

    const admin = await Admin.findById(id);
    if (!admin) throw Error("User not found!");

    if (password !== confirmPwd) throw Error("Passwords don't match");

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    //update the password
    await Admin.findByIdAndUpdate(
      id,
      { password: hashedPwd },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const verifyAdmin = async (req, res) => {
  const { token } = req.body;
  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    const admin = await Admin.findOne({ _id: id }).select(
      "-_id name email role"
    );
    if (!admin) throw Error("Admin not found");
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: "Request not authorized" });
  }
};

module.exports = {
  addAdmin,
  login,
  getAdmin,
  getMe,
  getAdmins,
  deleteAdmin,
  updateMe,
  updateUser,
  changeMyPwd,
  changeUserPwd,
  verifyAdmin,
};
