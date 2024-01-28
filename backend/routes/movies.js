const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware.js");

const db = admin.firestore();

// router.get("/", async (req, res) => {
//   try {
//     const projectsSnapshot = await db.collection("projects").get();
//     const projects = [];
//     projectsSnapshot.forEach((doc) => {
//       projects.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });
//     res.json(projects);
//   } catch (error) {
//     console.error("Error getting projects:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const projectDoc = await db.collection("projects").doc(projectId).get();

//     if (!projectDoc.exists) {
//       return res.status(404).send("Project not found");
//     }

//     const projectData = {
//       id: projectDoc.id,
//       ...projectDoc.data(),
//     };

//     res.json(projectData);
//   } catch (error) {
//     console.error("Error getting project by ID:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.post("/", verifyToken, async (req, res) => {
//   try {
//     let docRef = db.collection("projects").doc();

//     if (!req.body.name || !req.body.description || !req.body.startDate) {
//       res.json({ message: "Project must contain all data." });
//     }

//     await docRef.set({
//       projectId: docRef.id,
//       name: req.body.name,
//       description: req.body.description,
//       startDate: req.body.startDate,
//     });

//     res.json({ message: "Project added successfully" });
//   } catch (error) {
//     console.error("Unable to push new project:", error);
//     res.status(500).send("Unable to push new project.");
//   }
// });

// router.put("/:id", verifyToken, async (req, res) => {
//   try {
//     const id = req.params.id;
//     let docRef = db.collection("projects").doc(id);

//     if (!req.body.name || !req.body.description || !req.body.startDate) {
//       res.json({ message: "Project must contain all data." });
//     }

//     await docRef.update({
//       name: req.body.name,
//       description: req.body.description,
//       startDate: req.body.startDate,
//     });
//   } catch (error) {
//     console.error("Unable to update the project:", error);
//     res.status(500).send("Unable to update the project.");
//   }
// });

// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const projectId = req.params.id;

//     const teamMemberSnapshot = await db
//       .collection("team")
//       .where("projectId", "==", projectId)
//       .get();
//     const updatedPromises = [];
//     teamMemberSnapshot.forEach((doc) => {
//       updatedPromises.push(
//         doc.ref.update({
//           projectId: null,
//           projectName: null,
//           projectDescription: null,
//           projectStartDate: null,
//         })
//       );
//     });
//     await Promise.all(updatedPromises);

//     const projectDoc = db.collection("projects").doc(projectId);
//     const snapshot = await projectDoc.get();
//     if (!snapshot.exists) {
//       return res.status(404).send("Project not found");
//     }

//     await projectDoc.delete();
//     res.send("Project deleted successfully");
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
