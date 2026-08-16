//external
const express = require("express");

//local
const {
  getAddHome,
  postAddHome,
  getHostHomes,
  getEditHome,
  postEditHome,
  postDeleteHome,
} = require("../controllers/hostController");

const hostRouter = express.Router();

hostRouter.get("/add-home", getAddHome);
hostRouter.post("/add-home", postAddHome);
hostRouter.get("/host-home-list", getHostHomes);
hostRouter.get("/edit-home/:homeId", getEditHome);
hostRouter.post("/edit-home/:homeId", postEditHome);
hostRouter.post("/delete-home/:homeId", postDeleteHome);
module.exports = hostRouter;
