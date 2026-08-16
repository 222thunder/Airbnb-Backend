const Home = require("../models/home");
const User = require("../models/user");

exports.getHomes = async (req, res, next) => {
  const registeredHomes = await Home.find();

  let favoriteIds = [];
  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) favoriteIds = user.favorites;
  }

  res.render("store/home-list", {
    registeredHomes: registeredHomes,
    favoriteIds: favoriteIds,
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.userType,
  });
};

exports.getBooking = async (req, res, next) => {
  res.render("store/bookings", {
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.userType,
  });
};

exports.getFavList = async (req, res, next) => {
  let favoriteHomes = [];
  let favoriteIds = [];
  const registeredHomes = await Home.find();

  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) favoriteIds = user.favorites;
  }

  favoriteHomes = registeredHomes.filter((home) =>
    favoriteIds.some((favId) => String(favId) === String(home._id))
  );

  res.render("store/fav-list", {
    registeredHomes: favoriteHomes,
    favoriteHomes: favoriteHomes,
    favoriteIds: favoriteIds,
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.userType,
  });
};

exports.postAddToFav = async (req, res, next) => {
  const homeId = req.body.homeId;

  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && !user.favorites.includes(homeId)) {
      user.favorites.push(homeId);
      await user.save();
    }
  }

  res.redirect("/homes");
};

exports.postRemoveFromFav = async (req, res, next) => {
  const homeId = req.body.homeId;

  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) {
      user.favorites = user.favorites.filter(
        (favId) => String(favId) !== String(homeId)
      );
      await user.save();
    }
  }

  res.redirect("/favorite");
};

exports.getIndex = async (req, res, next) => {
  const registeredHomes = await Home.find();

  let favoriteIds = [];
  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) favoriteIds = user.favorites;
  }

  res.render("store/index", {
    registeredHomes: registeredHomes,
    favoriteIds: favoriteIds,
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.userType,
  });
};

exports.getHomeId = async (req, res, next) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);

  let favoriteIds = [];
  if (req.session.isLoggedIn && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user) favoriteIds = user.favorites;
  }

  if (home) {
    res.render("store/home-details", {
      home: home,
      favoriteIds: favoriteIds,
      isFavorite: favoriteIds.some((fav) => String(fav) === String(homeId)),
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.userType,
    });
  } else {
    res.redirect("/homes");
    console.log("Home not found");
  }
};
