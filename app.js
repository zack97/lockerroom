const express = require("express");
const app = express();
const path = require("path");
const users = require("./routes/users");
// const lob = require("./routes/lobbyRoutes");
const pool = require("./helpers/database");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", users);
app;

app.get("/data", async (req, res) => {
  try {
    const query = "SELECT * FROM user";
    const results = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on https://localhost:${PORT}`);
});

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/lobby", require("./routes/lobbyRoutes"));
// app.use("/api/message", require("./routes/messageRoutes"));
