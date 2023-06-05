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
  },
  otp: {
    type: String,
  },
  role: {
    type: String,
    validator: function (type) {
      const allowedType = ["admin", "user"];
      if (allowedType.includes(type)) {
        return;
      } else {
        throw new Error(`the user can only be admin or the user  `);
      }
    },
    message: "the user can only be admin or the user ",
  },
});

// this fucntion would set the p[assword to encrypted password before saving the user into the database
userSchema.pre("save", async function (next) {
  try {
    console.log("Pre Save Hook");
    const encryptedPassword = await hashPassword(this.password);
    this.password = encryptedPassword;
    next();
  } catch (error) {
    console.log("Error while saving user", error);
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
