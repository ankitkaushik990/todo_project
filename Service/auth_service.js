const User = require("../Model/user");

exports.signup = async (name, email, password, phone) => {
  console.log("In Auth SignUp  ");
  const user = new User({ name, email, password, phone });
  await user.save();
  return user._id;
};
