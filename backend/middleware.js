const jwt = require("jsonwebtoken");

// Middleware to verify the authenticity of the user's session token.
function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).send({
      error: "Your session is not valid!",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret-key");
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(400).send({
      error: "Your session is not valid!",
    });
  }
}

// Middleware to validate user registration data.
function validateRegister(req, res, next) {
  const { email, password } = req.body;

  if (!email || !/.+@.+\..+/.test(email)) {
    return res.status(400).send({
      error: "Please enter a valid email!",
    });
  }

  if (!password || password.length < 8) {
    return res.status(400).send({
      error: "Please enter a password with a minimum of 8 characters!",
    });
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return res.status(400).send({
      error: "Please enter a password with at least one lowercase character!",
    });
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return res.status(400).send({
      error: "Please enter a password with at least one uppercase character!",
    });
  }

  if (!/(?=.*\d)/.test(password)) {
    return res.status(400).send({
      error: "Please enter a password with at least one digit!",
    });
  }

  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    return res.status(400).send({
      error: "Please enter a password with at least one special character!",
    });
  }

  next();
}

module.exports = { verifyToken, validateRegister };
