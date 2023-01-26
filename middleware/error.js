//redirect to not found page when url is unavailable
export default function (req, res, next) {
  res.status(404).redirect("/not_found");
}
