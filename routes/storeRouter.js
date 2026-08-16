const express = require("express");
const {
  getHomes,
  getBooking,
  getFavList,
  getIndex,
  getHomeId,
  postAddToFav,
  postRemoveFromFav,
} = require("../controllers/storeController");

const storeRouter = express.Router();
storeRouter.get("/", getIndex);
storeRouter.get("/bookings", getBooking);
storeRouter.get("/favorite", getFavList);
storeRouter.post("/favorite/add", postAddToFav);
storeRouter.post("/favorite/remove", postRemoveFromFav);
storeRouter.get("/homes", getHomes);
storeRouter.get("/homes/:homeId", getHomeId);
module.exports = storeRouter;
