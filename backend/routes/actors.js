const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const actorsDB = await db.collection("actors").get();
    const actors = [];
    actorsDB.forEach((doc) => {
      actors.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(actors);
  } catch (error) {
    console.error("Error getting actors:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const actorsId = req.params.id;
    const actorsDoc = await db.collection("actors").doc(actorsId).get();

    if (!actorsDoc.exists) {
      return res.status(404).send("Actors not found");
    }

    const actorsData = {
      id: actorsDoc.id,
      ...actorsDoc.data(),
    };

    res.json(actorsData);
  } catch (error) {
    console.error("Error getting actors by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    let docRef = db.collection("actors").doc();
    const movieId = req.body.movieId;
    let movieData = {
      movieTitle: null,
      movieDescription: null,
      movieGenre: null,
      movieDuration: null,
    };

    if (movieId) {
      const movieDoc = await db.collection("movies").doc(movieId).get();

      if (movieDoc.exists) {
        movieData = {
          movieTitle: movieDoc.data().title,
          movieDescription: movieDoc.data().description,
          movieGenre: movieDoc.data().genre,
          movieDuration: movieDoc.data().duration,
        };
      }
    }

    if (
      !req.body.name ||
      !req.body.role ||
      !req.body.character ||
      !req.body.birthday
    ) {
      res.json({ message: "Actors data incomplete." });
    }

    await docRef.set({
      name: req.body.name,
      role: req.body.role,
      character: req.body.character,
      birthday: req.body.birthday,
      movieId,
      ...movieData,
    });

    res.json({ message: "Actors added successfully" });
  } catch (error) {
    console.error("Unable to push new actors:", error);
    res.status(500).send("Unable to push new actors.");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    let docRef = db.collection("actors").doc(id);

    if (
      !req.body.name ||
      !req.body.role ||
      !req.body.character ||
      !req.body.birthday
    ) {
      res.json({ message: "Actors data incomplete." });
    }

    await docRef.update({
      name: req.body.name,
      role: req.body.role,
      character: req.body.character,
      birthday: req.body.birthday,
      movieId: req.body.movieId,
    });
  } catch (error) {
    console.error("Unable to update the actors:", error);
    res.status(500).send("Unable to update the actors.");
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const actorsDoc = db.collection("actors").doc(id);
    const snapshot = await actorsDoc.get();

    if (!snapshot.exists) {
      return res.status(404).send("Actors not found");
    }

    await actorsDoc.delete();
    res.send("Actors deleted successfully");
  } catch (error) {
    console.error("Error deleting actors:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
