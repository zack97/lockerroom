// src/models/Message.js

const db = require("../helpers/database");

class Message {
  static async createMessage(lobbyId, userId, content) {
    const query =
      "INSERT INTO messages (lobby_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [lobbyId, userId, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findMessagesByLobbyId(lobbyId) {
    const query = "SELECT * FROM messages WHERE lobby_id = $1";
    const values = [lobbyId];
    const { rows } = await pool.query(query, values);
    return rows;
  }
}

module.exports = Message;
