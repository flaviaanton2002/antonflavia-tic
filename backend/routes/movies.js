const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");
const db = admin.firestore();
const { faker } = require("@faker-js/faker");

router.get("/", async (req, res) => {
  try {
    const moviesSnapshot = await db.collection("movies").get();
    const movies = [];
    moviesSnapshot.forEach((doc) => {
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
    const projectId = req.params.id;
    const projectDoc = await db.collection("movies").doc(projectId).get();

    if (!projectDoc.exists) {
      return res.status(404).send("Movie not found");
    }

    const projectData = {
      id: projectDoc.id,
      ...projectDoc.data(),
    };

    res.json(projectData);
  } catch (error) {
    console.error("Error getting Movie by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

////VERIFY TOKEN!!!
router.post("/", verifyToken, async (req, res) => {
  try {
    let docRef = db.collection("movies").doc();

    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.genre ||
      !req.body.image
    ) {
      res.json({ message: "Movie must contain all data." });
      return;
    }

    await docRef.set({
      movieId: docRef.id,
      name: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      image: req.body.image,
    });

    res.json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Unable to push new movie:", error);
    res.status(500).send("Unable to push new movie.");
  }
});

router.post("/generateRandomMovie", async (req, res) => {
  try {
    let docRef = db.collection("movies").doc();

    await docRef.set({
      movieId: faker.string.alpha(),
      name: faker.word.adverb(100),
      description: faker.word.adjective(),
      genre: faker.word.adjective(),
      image: faker.image.urlPicsumPhotos(),
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
    let docRef = db.collection("projects").doc(id);

    if (!req.body.name || !req.body.description || !req.body.startDate) {
      res.json({ message: "Project must contain all data." });
    }

    await docRef.update({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
    });
  } catch (error) {
    console.error("Unable to update the project:", error);
    res.status(500).send("Unable to update the project.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const moviesSnapshot = await db
      .collection("movies")
      .where("movieId", "==", movieId)
      .get();
    const updatedPromises = [];
    moviesSnapshot.forEach((doc) => {
      updatedPromises.push(
        doc.ref.update({
          projectId: null,
          projectName: null,
          projectDescription: null,
          projectStartDate: null,
        })
      );
    });
    await Promise.all(updatedPromises);

    const moviesDoc = db.collection("movies").doc(movieId);
    const snapshot = await moviesDoc.get();
    if (!snapshot.exists) {
      return res.status(404).send("Movie not found");
    }

    await moviesDoc.delete();
    res.send("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting Movie:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
