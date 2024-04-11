const express = require("express");
const jwt = require("jsonwebtoken");
const Lobby = require("../models/lobby");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { name } = req.body;
  try {
    // Check if user is authenticated
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Create lobby
    const newLobby = await Lobby.createLobby(name, adminId);

    return res.json(newLobby);
  } catch (error) {
    console.error("Error creating lobby:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:lobbyId", async (req, res) => {
  const { lobbyId } = req.params;
  try {
    // Find lobby by ID
    const lobby = await Lobby.findLobbyById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: "Lobby not found" });
    }

    return res.json(lobby);
  } catch (error) {
    console.error("Error fetching lobby:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
