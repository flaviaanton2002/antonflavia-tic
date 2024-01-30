const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const moviesDB = await db.collection("movies").get();
    const movies = [];
    moviesDB.forEach((doc) => {
      movies.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(movies);
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movieDoc = await db.collection("movies").doc(id).get();

    if (!movieDoc.exists) {
      return res.status(404).send("Movie not found");
    }

    const movieData = {
      id: movieDoc.id,
      ...movieDoc.data(),
    };

    res.json(movieData);
  } catch (error) {
    console.error("Error getting movie by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    let docRef = db.collection("movies").doc();

    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.genre ||
      !req.body.duration
    ) {
      res.json({ message: "Movie must contain all data." });
    }

    await docRef.set({
      movieId: docRef.id,
      title: req.body.title,
      description: req.body.description,
      genre: req.body.genre,
      duration: req.body.duration,
    });

    res.json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Unable to push new movie:", error);
    res.status(500).send("Unable to push new movie.");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    let docRef = db.collection("movies").doc(id);

    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.genre ||
      !req.body.duration
    ) {
      res.json({ message: "Movie must contain all data." });
    }

    await docRef.update({
      title: req.body.title,
      description: req.body.description,
      genre: req.body.genre,
      duration: req.body.duration,
    });
  } catch (error) {
    console.error("Unable to update the movie:", error);
    res.status(500).send("Unable to update the movie.");
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    const actorsDB = await db.collection("actors").where("id", "==", id).get();
    const updatedPromises = [];
    actorsDB.forEach((doc) => {
      updatedPromises.push(
        doc.ref.update({
          title: null,
          description: null,
          genre: null,
          duration: null,
        })
      );
    });
    await Promise.all(updatedPromises);

    const movieDoc = db.collection("movies").doc(id);
    const snapshot = await movieDoc.get();
    if (!snapshot.exists) {
      return res.status(404).send("Movie not found");
    }

    await movieDoc.delete();
    res.send("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
