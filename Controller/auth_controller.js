const authService = require("../Service/auth_service");

exports.signup = async (req, res) => {
  console.log("In POST register User ");
  try {
    const { name, email, password, phone, role } = req.body;
    const _id = await authService.signup(name, email, password, phone, role);
    res.status(201).send({ id: _id });
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ message: error.message });
  }
};

exports.verifyotp = async (req, res) => {
  console.log("enter your OTP");
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.status(200).send({ message: `account Verified , welcome` });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  console.log("In POST login User ");
  try {
    const { email, password: inputPassword } = req.body;
    const { userId, token } = await authService.login(email, inputPassword);
    res.status(200).send({ userId, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    let loggedInUser = req.loggedInUser;

    await authService.logout(loggedInUser._id);
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    console.log("In verifyToken ", req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error({ message: "no token found" });

    const token = authHeader.split(" ")[0];
    if (!token)
      throw new Error({ message: "no token found please send token" });
    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};
exports.disable = async (req, res) => {
  console.log("in disabling the account");
  try {
    let loggedInUser = req.loggedInUser;
    await authService.disable(loggedInUser._id);
    res.status(200).send({ message: "Account disabled" });
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.editAcc = async (req, res) => {
  console.log("in editing the user ");
  try {
    let loggedInUser = req.loggedInUser;
    const { name, email, password, phone, role } = req.body;
    const update = await authService.editAcc(
      loggedInUser._id,
      name,
      email,
      password,
      phone,
      role
    );
    res.status(200).send({ updated_Successfully: update });
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};
