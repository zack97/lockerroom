// src/models/Lobby.js

const db = require("./helpers/database");

class Lobby {
  static async createLobby(name, adminId) {
    const query =
      "INSERT INTO lobbies (name, admin_id) VALUES ($1, $2) RETURNING *";
    const values = [name, adminId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findLobbyById(lobbyId) {
    const query = "SELECT * FROM lobbies WHERE id = $1";
    const values = [lobbyId];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

module.exports = Lobby;
