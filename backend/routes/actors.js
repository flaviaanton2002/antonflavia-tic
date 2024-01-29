const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const teamSnapshot = await db.collection("team").get();
    const team = [];
    teamSnapshot.forEach((doc) => {
      team.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(team);
  } catch (error) {
    console.error("Error getting team member:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamDoc = await db.collection("team").doc(teamId).get();

    if (!teamDoc.exists) {
      return res.status(404).send("Team member not found");
    }

    const teamData = {
      id: teamDoc.id,
      ...teamDoc.data(),
    };

    res.json(teamData);
  } catch (error) {
    console.error("Error getting team member by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addActor", async (req, res) => {
  try {
    let docRef = db.collection("actors").doc();
    const projectId = req.body.projectId;
    let projectData = {
      projectName: null,
      projectDescription: null,
    };

    if (projectId) {
      const projectDoc = await db.collection("movies").doc(projectId).get();

      if (projectDoc.exists) {
        projectData = {
          projectName: projectDoc.data().name,
          projectDescription: projectDoc.data().description,
        };
      }
    }

    if (!req.body.name || !req.body.description) {
      res.json({ message: "Actors data incomplete." });
    }

    await docRef.set({
      email: req.body.email,
      projectId,
      ...projectData,
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
    const teamId = req.params.id;
    const teamDoc = db.collection("team").doc(teamId);
    const snapshot = await teamDoc.get();

    if (!snapshot.exists) {
      return res.status(404).send("Team member not found");
    }

    await teamDoc.delete();
    res.send("Team member deleted successfully");
  } catch (error) {
    console.error("Error deleting Team member:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
