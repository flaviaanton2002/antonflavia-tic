const admin = require("firebase-admin");
const serviceAccount = require("./antonflavia-tic-3246c-firebase-adminsdk-w519y-8bed1a7f56.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

console.log("Firebase initialized successfully!");

module.exports = { db: firestore };
