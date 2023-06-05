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
    from: "+12706068167",
    to: `+${phone}`,
  });
  a;
  return message;
};

exports.signup = async (name, email, password, phone) => {
  console.log("In Auth SignUp  ");
  const user = new User({ name, email, password, phone });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();
  await sendOtp(otp, phone);
  return user._id;
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
  console.log("In Auth login  ");
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  await User.findOneAndUpdate({ _id: user._id }, { token: token });
  console.log(user._id);
  return { userId: user._id, token };
};

exports.logout = async (id) => {
  console.log("In Auth logout ");
  const user = await User.findOne({ _id: id });
  user.token = null;
  await User.findOneAndUpdate({ _id: user._id }, { token: "" });
};

exports.verifyToken = async (token) => {
  console.log("In Auth verifyToken ");
  const payload = await jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ _id: payload._id });
  if (!user) {
    throw new Error("User not found or deactivated");
  } else if (!user.token || user.token != token) {
    throw new Error("Access Denied. please login");
  }
  console.log("payload " + payload);
  return user;
};
