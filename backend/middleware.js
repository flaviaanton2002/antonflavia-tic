const jwt = require("jsonwebtoken");

// Middleware to verify the authenticity of the user's session token.
function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).send({
      message: "Your session is not valid!",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret-key");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(400).send({
      message: "Your session is not valid!",
    });
  }
}

// Middleware to validate user registration data.
function validateRegister(req, res, next) {
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).send({
      message: "Please enter a password with a minimum of 8 characters!",
    });
  }

  next();
}

module.exports = { verifyToken, validateRegister };
