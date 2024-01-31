const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");
const { faker } = require("@faker-js/faker");

const db = admin.firestore();

router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const actorsSnapshot = await db
      .collection("actors")
      .where("movieId", "==", movieId)
      .get();

    const actors = [];
    actorsSnapshot.forEach((doc) => {
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

router.post("/", verifyToken, async (req, res) => {
  try {
    let docRef = db.collection("actors").doc();
    const movieId = req.body.movieId;
    let movieData = {
      projectName: null,
      projectDescription: null,
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
      !req.body.description ||
      !req.body.age ||
      !req.body.image
    ) {
      res.json({ message: "Actors data incomplete." });
    }

    await docRef.set({
      name: req.body.name,
      description: req.body.description,
      age: req.body.age,
      image: req.body.image,
      movieId,
      ...movieData,
    });

    res.json({ message: "Team member added successfully" });
  } catch (error) {
    console.error("Unable to push new Team member:", error);
    res.status(500).send("Unable to push new Team member.");
  }
});

router.post("/generateRandomActor", async (req, res) => {
  try {
    let docRef = db.collection("actors").doc();
    const movieId = req.body.movieID;
    let movieData = {
      projectName: null,
      projectDescription: null,
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

    await docRef.set({
      name: faker.person.fullName(),
      description: faker.word.adjective(),
      age: faker.number.int(100),
      image:
        "https://m.media-amazon.com/images/M/MV5BMGI3OTI0NjctMjM2ZC00MjZiLWIxMjctODczN2M4MTFjZmY1XkEyXkFqcGdeQXJoYW5uYWg@._V1_.jpg",
      movieId,
      ...movieData,
    });

    res.json({ message: "Team member added successfully" });
  } catch (error) {
    console.error("Unable to push new Team member:", error);
    res.status(500).send("Unable to push new Team member.");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    let docRef = db.collection("team").doc(id);

    if (!req.body.name || !req.body.function || !req.body.email) {
      res.json({ message: "Team member data incomplete." });
    }

    await docRef.update({
      name: req.body.name,
      function: req.body.function,
      email: req.body.email,
      projectId: req.body.projectId,
    });
  } catch (error) {
    console.error("Unable to update the Team member:", error);
    res.status(500).send("Unable to update the Team member.");
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const actorId = req.params.id;
    const actorsDoc = db.collection("actors").doc(actorId);
    const snapshot = await actorsDoc.get();

    if (!snapshot.exists) {
      return res.status(404).send("Actor member not found");
    }

    await actorsDoc.delete();
    res.send("Actor deleted successfully");
  } catch (error) {
    console.error("Error deleting actor:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
