const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  verifyToken,
  verifyotp,
  disable,
  editAcc,
  delAcc,
} = require("../Controller/auth_controller");
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verify").post(verifyotp);
router.route("/logout").post(verifyToken, logout);
router.route("/disable").delete(verifyToken, disable);
router.route("/edit").put(verifyToken, editAcc);
router.route("/account").delete(verifyToken, delAcc);
module.exports = router;
