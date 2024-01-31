const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./database.js");

const port = 3000;

const app = express();

const moviesRoutes = require("./routes/movies.js");
const actorsRoutes = require("./routes/actors.js");
const authRoutes = require("./routes/auth.js");

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/actors", actorsRoutes);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
