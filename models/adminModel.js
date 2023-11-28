const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

adminSchema.statics.addAdmin = async function (
  name,
  email,
  role,
  password,
  confirmPwd
) {
  if (!name || !email || !password || !role) {
    throw Error("Please fill all required fields.");
  }

  if (!validator.isEmail(email)) {
    throw Error("Not a valid email");
  }

  const admin = await this.findOne({ email });
  if (admin) throw Error("email already in use");

  if (password !== confirmPwd) {
    throw Error("passwords don't match");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  try {
    const admin = await this.create({ name, email, role, password: hashedPwd });
    return admin;
  } catch (error) {
    throw Error(Error);
  }
};
adminSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All Fields Must be filled");
  }

  const admin = await this.findOne({ email });
  if (!admin) throw Error("No Admin found by this email");

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error("password not correct");
  }

  return admin;
};


module.exports = mongoose.model("Admin", adminSchema);
