const express = require("express");
//local
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/login", getLogin);
authRouter.post("/login", postLogin);
authRouter.get("/signup", getSignUp);
authRouter.post("/signup", postSignUp);
authRouter.post("/logout", postLogout);
module.exports = authRouter;
