const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegister } = require("../middleware.js");

const db = admin.firestore();

router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the same email already exists
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const docRef = db.collection("users").doc();
    await docRef.set({
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Registered successfully!",
    });
  } catch (error) {
    console.error("Error during register:", error);
    return res.status(500).json({ error: "Register failed!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "User data incomplete!" });
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (userSnapshot.empty) {
      return res.status(401).json({ error: "Invalid email!" });
    }

    const user = userSnapshot.docs[0].data();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const token = jwt.sign({ userId: user.email }, "secret-key", {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Logged in successfully!",
      token,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Login failed!" });
  }
});

module.exports = router;
