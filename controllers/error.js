exports.getError = (req, res, next) => {
  res.status(404).render("404", {
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.userType,
  });
};
