const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(400).send({
      message: "Your session is not valid!",
    });
  }
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secret-key");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(400).send({
      message: "Your session is not valid!",
    });
  }
}

function validateRegister(req, res, next) {
  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).send({
      message: "Please enter a password with min. 8 chars",
    });
  }
  next();
}

module.exports = { verifyToken, validateRegister };
