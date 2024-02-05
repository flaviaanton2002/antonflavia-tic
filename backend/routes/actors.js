const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");
const { faker } = require("@faker-js/faker");
const { isValid, isAfter } = require("date-fns");

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

// GET an actor by ID
router.get("/getActor/:id", async (req, res) => {
  try {
    const actorId = req.params.id;
    const actorDoc = await db.collection("actors").doc(actorId).get();

    if (!actorDoc.exists) {
      return res.status(404).json({ error: "Actor not found!" });
    }

    const actorData = {
      id: actorDoc.id,
      ...actorDoc.data(),
    };

    res.json(actorData);
  } catch (error) {
    console.error("Error getting actor by ID:", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

// POST add a new actor
router.post("/addActor", verifyToken, async (req, res) => {
  try {
    const movieId = req.body.movieId;
    let movieData = {
      movieName: null,
      movieDescription: null,
      movieGenre: null,
      movieImage: null,
    };
    if (movieId) {
      const movieDoc = await db.collection("movies").doc(movieId).get();
      if (movieDoc.exists) {
        movieData = {
          movieName: movieDoc.data().name,
          movieDescription: movieDoc.data().description,
          movieGenre: movieDoc.data().genre,
          movieImage: movieDoc.data().image,
        };
      }
    }

    const { name, role, birthday, image } = req.body;

    if (!name || !role || !birthday || !image) {
      return res.status(400).json({ error: "Actor data incomplete!" });
    }

    const dateFormatValid = /\d{4}-\d{2}-\d{2}/.test(birthday);
    if (!dateFormatValid) {
      return res
        .status(400)
        .json({ error: "Birthday format is invalid! (YYYY-MM-DD)" });
    }
    const inputDate = new Date(birthday);
    const currentDate = new Date();
    if (!isValid(inputDate) || isAfter(inputDate, currentDate)) {
      return res.status(400).json({ error: "Invalid birthday!" });
    }

    if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(image)) {
      return res.status(400).json({ error: "Invalid image URL format!" });
    }

    const docRef = db.collection("actors").doc();
    await docRef.set({
      name,
      role,
      birthday,
      image,
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
    const movieId = req.body.movieId;
    let movieData = {
      movieName: null,
      movieDescription: null,
      movieGenre: null,
      movieImage: null,
    };
    if (movieId) {
      const movieDoc = await db.collection("movies").doc(movieId).get();
      if (movieDoc.exists) {
        movieData = {
          movieName: movieDoc.data().name,
          movieDescription: movieDoc.data().description,
          movieGenre: movieDoc.data().genre,
          movieImage: movieDoc.data().image,
        };
      }
    }

    const docRef = db.collection("actors").doc();
    var birt = faker.date.birthdate();
    await docRef.set({
      name: faker.person.fullName(),
      role: faker.person.firstName(),
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
router.put("/editActor/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("actors").doc(id);

    const { name, role, birthday, image } = req.body;

    if (!name || !role || !birthday || !image) {
      return res.status(400).json({ error: "Actor data incomplete!" });
    }

    const dateFormatValid = /\d{4}-\d{2}-\d{2}/.test(birthday);
    const currentDate = new Date();
    const inputDate = new Date(birthday);
    if (!dateFormatValid || inputDate > currentDate) {
      return res.status(400).json({ error: "Invalid birthday!" });
    }

    if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(image)) {
      return res.status(400).json({ error: "Invalid image URL format!" });
    }

    await docRef.update({
      name,
      role,
      birthday,
      image,
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
    const actorDoc = db.collection("actors").doc(actorId);
    const actorSnapshot = await actorDoc.get();
    if (!actorSnapshot.exists) {
      return res.status(404).send("Actor not found!");
    }

    await actorDoc.delete();
    res.send("Actor deleted successfully!");
  } catch (error) {
    console.error("Error deleting actor:", error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
