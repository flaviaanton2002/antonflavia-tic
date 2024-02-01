const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");
const { faker } = require("@faker-js/faker");

const db = admin.firestore();

// GET actors by movie ID
router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const actorsSnapshot = await db
      .collection("actors")
      .where("movieId", "==", movieId)
      .get();

    const actors = actorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(actors);
  } catch (error) {
    console.error("Error getting actors:", error);
    res.status(500).send("Internal server error!");
  }
});

// POST add a new actor
router.post("/addActor", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("actors").doc();
    const movieId = req.body.movieId;

    let movieData = {
      movieName: null,
      movieDescription: null,
    };

    if (movieId) {
      const movieDoc = await db.collection("movies").doc(movieId).get();

      if (movieDoc.exists) {
        movieData = {
          movieName: movieDoc.data().name,
          movieDescription: movieDoc.data().description,
        };
      }
    }

    if (
      !req.body.name ||
      !req.body.role ||
      !req.body.birthday ||
      !req.body.image
    ) {
      return res.json({ message: "Actor data incomplete!" });
    }

    await docRef.set({
      name: req.body.name,
      role: req.body.role,
      birthday: req.body.birthday,
      image: req.body.image,
      movieId,
      ...movieData,
    });

    res.json({ message: "Actor added successfully!" });
  } catch (error) {
    console.error("Unable to add a new actor:", error);
    res.status(500).send("Unable to add a new actor!");
  }
});

// POST add a new random actor
router.post("/addRandomActor", verifyToken, async (req, res) => {
  try {
    const docRef = db.collection("actors").doc();
    const movieId = req.body.movieID;

    let movieData = {
      movieName: null,
      movieDescription: null,
    };

    if (movieId) {
      const movieDoc = await db.collection("movies").doc(movieId).get();

      if (movieDoc.exists) {
        movieData = {
          movieName: movieDoc.data().name,
          movieDescription: movieDoc.data().description,
        };
      }
    }

    var birt = faker.date.birthdate();
    await docRef.set({
      name: faker.person.fullName(),
      role: faker.person.jobType(),
      birthday: birt.toISOString().split("T")[0],
      image: faker.image.urlLoremFlickr({ category: "people" }),
      movieId,
      ...movieData,
    });

    res.json({ message: "Random actor added successfully!" });
  } catch (error) {
    console.error("Unable to add a new random actor:", error);
    res.status(500).send("Unable to add a new random actor!");
  }
});

// PUT update an actor by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("actors").doc(id);

    if (
      !req.body.name ||
      !req.body.role ||
      !req.body.birthday ||
      !req.body.image
    ) {
      return res.json({ message: "Actor data incomplete!" });
    }

    await docRef.update({
      name: req.body.name,
      role: req.body.role,
      birthday: req.body.birthday,
      image: req.body.image,
      movieId: req.body.movieId,
    });

    res.json({ message: "Actor updated successfully!" });
  } catch (error) {
    console.error("Unable to update the actor:", error);
    res.status(500).send("Unable to update the actor!");
  }
});

// DELETE an actor by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const actorId = req.params.id;
    const actorsDoc = db.collection("actors").doc(actorId);
    const snapshot = await actorsDoc.get();

    if (!snapshot.exists) {
      return res.status(404).send("Actor not found!");
    }

    await actorsDoc.delete();
    res.send("Actor deleted successfully!");
  } catch (error) {
    console.error("Error deleting actor:", error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
