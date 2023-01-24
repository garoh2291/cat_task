//redirect to not found page when url is unavailable
module.exports = function (req, res, next) {
  res.status(404).redirect("/not_found");
};
