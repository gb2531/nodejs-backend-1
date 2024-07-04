const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(403).send("Access denied.");

    jwt.verify(
      token,
      "3488ad5c31f289d63f30be96e98f62d4abd356a57a7402f4d10ba2b45edcaf85c7a2f6e7ed3d0d9add1c8969f0631dbe696362d2890ea086c0ae96ec03f2bb3",
      (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = user;
        next();
      }
    );
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
