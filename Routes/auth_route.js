const express = require("express");
const router = express.Router();
const { signup } = require("../Controller/auth_controller");

router.route("/signup").post(signup);
module.exports = router;
