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

// GET a movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieDoc = await db.collection("movies").doc(movieId).get();

    if (!movieDoc.exists) {
      return res.status(404).json({ error: "Movie not found!" });
    }

    const movieData = {
      id: movieDoc.id,
      ...movieDoc.data(),
    };

    res.json(movieData);
  } catch (error) {
    console.error("Error getting movie by ID:", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

// POST add a new movie
router.post("/addMovie", verifyToken, async (req, res) => {
  try {
    const { name, description, genre, image } = req.body;

    if (!name || !description || !genre || !image) {
      return res.status(400).json({ error: "Movie date incomplete!" });
    }

    const validGenres = ["Comedy", "Drama", "Action", "Thriller", "Fantastic"];
    if (!validGenres.includes(genre)) {
      return res.status(400).json({ error: "Invalid genre!" });
    }

    if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(image)) {
      return res.status(400).json({ error: "Invalid image URL format!" });
    }

    const docRef = db.collection("movies").doc();
    await docRef.set({
      movieId: docRef.id,
      name,
      description,
      genre,
      image,
    });

    res.json({ message: "Movie added successfully!" });
  } catch (error) {
    console.error("Unable to add a new movie:", error);
    res.status(500).json({ error: "Unable to add a new movie!" });
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
router.put("/editMovie/:id", verifyToken, async (req, res) => {
  try {
    const movieId = req.params.id;
    const docRef = db.collection("movies").doc(movieId);

    const { name, description, genre, image } = req.body;

    if (!name || !description || !genre || !image) {
      return res.status(400).json({ error: "Movie must contain all data!" });
    }

    const validGenres = ["Comedy", "Drama", "Action", "Thriller", "Fantastic"];
    if (!validGenres.includes(genre)) {
      return res.status(400).json({ error: "Invalid genre!" });
    }

    if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(image)) {
      return res.status(400).json({ error: "Invalid image URL format!" });
    }

    await docRef.update({
      name,
      description,
      genre,
      image,
    });

    const actorsSnapshot = await db
      .collection("actors")
      .where("movieId", "==", movieId)
      .get();
    const batch = db.batch();

    actorsSnapshot.forEach((actorDoc) => {
      const actorRef = db.collection("actors").doc(actorDoc.id);

      batch.update(actorRef, {
        movieName: name,
        movieDescription: description,
        movieGenre: genre,
        movieImage: image,
      });
    });

    await batch.commit();

    res.json({ message: "Movie and actors updated successfully!" });
  } catch (error) {
    console.error("Unable to update the movie and actors:", error);
    res.status(500).send("Unable to update the movie and actors!");
  }
});

// DELETE a movie by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieDoc = db.collection("movies").doc(movieId);
    const movieSnapshot = await movieDoc.get();
    if (!movieSnapshot.exists) {
      return res.status(404).send("Movie not found!");
    }

    const actorsSnapshot = await db
      .collection("actors")
      .where("movieId", "==", movieId)
      .get();
    const actorDeletionPromises = actorsSnapshot.docs.map((actorDoc) =>
      actorDoc.ref.delete()
    );
    await Promise.all(actorDeletionPromises);

    await movieDoc.delete();
    res.send("Movie deleted successfully!");
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
