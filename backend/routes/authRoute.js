const express = require("express");
const router = express.Router();
const {registerController, loginController, testController} = require("../controllers/authController");
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware");

//Register Route
router.post("/register", registerController);

//Login Route
router.post("/login", loginController)

//Test for Protected Route
router.get("/test", requireSignIn, isAdmin, testController)

//User Protected Route
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

//Admin Protected Route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });

module.exports = router