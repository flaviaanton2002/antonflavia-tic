const admin = require("firebase-admin");

const serviceAccount = require("./antonflavia-tic-3246c-firebase-adminsdk-w519y-8bed1a7f56.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized successfully!");

const db = admin.firestore();

module.exports = { db };
