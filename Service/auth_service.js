const User = require("../Model/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const client = require("twilio")(
  process.env.ACCOUNT_SSID,
  process.env.AUTH_KEY
);

const sendOtp = async function (otp, phone) {
  const message = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12545002266",
    to: `+${phone}`,
  });
  return message;
};

exports.signup = async (name, email, password, phone, role) => {
  const user = new User({ name, email, password, phone, role });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  let send = await sendOtp(otp, phone);
  if (!send) {
    throw new Error(` error under twilio`);
  } else {
    await user.save();
    return user._id;
  }
};

exports.verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Incorrect OTP");
  }
  await User.findOneAndUpdate(
    { email: email },
    { $set: { otp: "", isActive: true } },
    { new: true }
  );

  return `singup SuccessFully ${user}`;
};

exports.login = async (email, inputPassword) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  await User.findOneAndUpdate({ _id: user._id }, { token: token });
  return { userId: user._id, token };
};

exports.logout = async (id) => {
  const user = await User.findOne({ _id: id });
  user.token = null;
  await User.findOneAndUpdate({ _id: user._id }, { token: "" });
};

exports.verifyToken = async (token) => {
  const payload = await jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ _id: payload._id });
  if (!user) {
    throw new Error("User not found or deactivated");
  } else if (!user.token || user.token != token) {
    throw new Error("Access Denied. please login");
  }
  return user;
};

exports.disable = async (id) => {
  await User.findByIdAndUpdate({ _id: id }, { isActive: false, token: "" });
};

exports.editAcc = async (id, name, email, password, phone, role) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    return `user not found`;
  }

  user.name = name;
  user.email = email;
  user.password = password;
  user.phone = phone;
  user.role = role;

  await user.save(); // Save the updated user object

  return { name: user.name, email: user.email };
};
