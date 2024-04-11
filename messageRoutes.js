// src/routes/messageRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const Message = require("./message");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { lobbyId, content } = req.body;
  try {
    // Check if user is authenticated
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Create message
    const newMessage = await Message.createMessage(lobbyId, userId, content);

    return res.json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/lobby/:lobbyId", async (req, res) => {
  const { lobbyId } = req.params;
  try {
    // Find messages by lobby ID
    const messages = await Message.findMessagesByLobbyId(lobbyId);
    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
