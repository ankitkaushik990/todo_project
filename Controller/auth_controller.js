const authService = require("../Service/auth_service");
const logger = require("../config/logger");

exports.signup = async (req, res) => {
  logger.info("in signup the user  ");
  try {
    const { name, email, password, phone, role } = req.body;
    const _id = await authService.signup(name, email, password, phone, role);
    res.status(201).send({ id: _id });
  } catch (error) {
    logger.error(error.message);
    res.status(401).send({ message: error.message });
  }
};

exports.verifyotp = async (req, res) => {
  logger.info("in verifying the otp");
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.status(200).send({ message: `account Verified , welcome` });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  logger.info("in logging in the user  ");
  try {
    const { email, password: inputPassword } = req.body;
    const { userId, token } = await authService.login(email, inputPassword);
    res.status(200).send({ userId, token });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  logger.info("In logging out the user  ");
  try {
    let loggedInUser = req.loggedInUser;

    await authService.logout(loggedInUser._id);
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    logger.info("In verifyToken ");
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error({ message: "no token found" });

    const token = authHeader.split(" ")[0];
    if (!token)
      throw new Error({ message: "no token found please send token" });
    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    logger.error("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};
exports.disable = async (req, res) => {
  logger.info("in disabling the account");
  try {
    let loggedInUser = req.loggedInUser;
    await authService.disable(loggedInUser._id);
    res.status(200).send({ message: "Account disabled" });
  } catch (error) {
    logger.error("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.editAcc = async (req, res) => {
  logger.info("in editing the user ");
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
    logger.error("error in modifying account ", error);
    res.status(400).send({ message: error.message });
  }
};
