const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false,
    errorMessage: null,
    oldInput: { email: "" },
    userType: null,
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: "User does not exist. Please sign up first.",
      oldInput: { email, rememberMe },
      userType: null,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: "Invalid password. Please try again.",
      oldInput: { email, rememberMe },
      userType: null,
    });
  }

  if (rememberMe) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    req.session.cookie.maxAge = thirtyDays;
  } else {
    req.session.cookie.maxAge = null; //
  }

  req.session.isLoggedIn = true;
  req.session.userId = user._id.toString();
  req.session.userType = user.userType;

  req.session.save((err) => {
    if (err) {
      console.log("Error saving session:", err);
    }
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    isLoggedIn: false,
    errorMessage: null,
    oldInput: {},
    userType: null,
  });
};

exports.postSignUp = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        isLoggedIn: false,
        errorMessage: errors.array().map((error) => error.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        userType: null,
      });
    }
    const userPassword = password;
    bcrypt
      .hash(userPassword, 10)
      .then((hash) => {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hash,
          userType,
        });
        return newUser.save();
      })
      .then(() => {
        res.redirect("/login");
      });
  },
];

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }
    res.redirect("/login");
  });
};
