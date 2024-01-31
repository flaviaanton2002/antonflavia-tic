// Importing required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./database.js");

// Setting up the Express app
const app = express();
const port = 3000;

// Importing routes
const moviesRoutes = require("./routes/movies.js");
const actorsRoutes = require("./routes/actors.js");
const authRoutes = require("./routes/auth.js");

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Route setup
app.use("/", authRoutes);
app.use("/movies", moviesRoutes);
app.use("/actors", actorsRoutes);

// Starting the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
