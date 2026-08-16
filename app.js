//external
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);

//local
const rootDir = require("./utils/pathUtils");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const { getError } = require("./controllers/error");

//server created
const app = express();
//coustom render for ejs
app.set("view engine", "ejs");
app.set("views", "views");

DB_PATH = process.env.DB_PATH;
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "mySessions",
});

//file handler
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
};

app.use(express.urlencoded());
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "/uploads")));
app.use(multer(multerOptions).single("photo"));

sessionSecret = process.env.sessionSecret;
//session
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

//store
app.use(storeRouter);

//host - auth
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn && req.session.userType === "host") {
    next();
  } else {
    res.redirect("/homes");
  }
});

//host
app.use("/host", hostRouter);

//auth
app.use(authRouter);

//error
app.use(getError);

//server listen
PORT = process.env.PORT || 3000;
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to MongoDB:", err.message);
  });
