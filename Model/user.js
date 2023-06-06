const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200,
  },
  email: {
    type: String,
    trim: true,
    maxlength: 200,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
    maxlength: 100,
    minlength: 6,
  },
  token: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    // unique: true,
  },
  otp: {
    type: String,
  },
  role: {
    type: String,
    lowercase: true,
    validate: {
      validator: function (type) {
        const allowedTypes = ["admin", "user"];
        return allowedTypes.includes(type);
      },
      message: "The user can only be admin or user.",
    },
  },
});

// this fucntion would set the p[assword to encrypted password before saving the user into the database
userSchema.pre("save", async function (next) {
  try {
    const encryptedPassword = await hashPassword(this.password);
    this.password = encryptedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// this function would encrypt the password
// encryption done here
const hashPassword = async (password) => {
  console.log(password);
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model("User", userSchema);
