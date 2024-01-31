const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");
const { faker } = require("@faker-js/faker");

const db = admin.firestore();

// GET all movies
router.get("/", async (req, res) => {
  try {
    const moviesSnapshot = await db.collection("movies").get();
    const movies = moviesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(movies);
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).send("Internal server error!");
  }
});

// GET movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieDoc = await db.collection("movies").doc(movieId).get();

    if (!movieDoc.exists) {
      return res.status(404).send("Movie not found!");
    }

    const movieData = {
      id: movieDoc.id,
      ...movieDoc.data(),
    };

    res.json(movieData);
  } catch (error) {
    console.error("Error getting movie by ID:", error);
    res.status(500).send("Internal server error!");
  }
});

// POST add a new movie
router.post("/addMovie", verifyToken, async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.genre ||
      !req.body.image
    ) {
      return res.json({ message: "Movie must contain all data!" });
    }

    const docRef = db.collection("movies").doc();
    await docRef.set({
      movieId: docRef.id,
      name: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      image: req.body.image,
    });

    res.json({ message: "Movie added successfully!" });
  } catch (error) {
    console.error("Unable to add a new movie:", error);
    res.status(500).send("Unable to add a new movie!");
  }
});

// POST add a new random movie
router.post("/addRandomMovie", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("movies").doc();
    var name = faker.word.noun();
    var desc = faker.word.words(20);
    await docRef.set({
      movieId: faker.string.uuid(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      description: desc.charAt(0).toUpperCase() + desc.slice(1) + ".",
      genre: faker.helpers.arrayElement([
        "Comedy",
        "Drama",
        "Action",
        "Thriller",
        "Fantastic",
      ]),
      image: faker.image.url(),
    });

    res.json({ message: "Random movie added successfully!" });
  } catch (error) {
    console.error("Unable to add a new random movie:", error);
    res.status(500).send("Unable to add a new random movie!");
  }
});

// PUT update a movie by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const movieId = req.params.id;
    const docRef = db.collection("movies").doc(movieId);

    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.genre ||
      !req.body.image
    ) {
      return res.json({ message: "Movie must contain all data!" });
    }

    await docRef.update({
      name: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      image: req.body.image,
    });

    res.json({ message: "Movie updated successfully!" });
  } catch (error) {
    console.error("Unable to update the movie:", error);
    res.status(500).send("Unable to update the movie!");
  }
});

// DELETE a movie by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const movieId = req.params.id;
    const moviesDoc = db.collection("movies").doc(movieId);

    const snapshot = await moviesDoc.get();
    if (!snapshot.exists) {
      return res.status(404).send("Movie not found!");
    }

    await moviesDoc.delete();
    res.send("Movie deleted successfully!");
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
