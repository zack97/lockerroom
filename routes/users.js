const express = require("express");
const pool = require("../helpers/database");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/:id", async function (req, res) {
  try {
    const sqlquery = `SELECT id, email, password, register FROM user WHERE id=?`;
    const rows = await pool.query(sqlquery, req.params.id);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function sanitizeResult(result) {
  const sanitizedResult = { ...result };
  for (const key in sanitizedResult) {
    console.log(key);
    if (typeof sanitizedResult[key] === "bigint") {
      sanitizedResult[key] = sanitizedResult[key].toString();
    }
  }
  return sanitizedResult;
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const query = `SELECT * FROM user WHERE email=?`;
    const values = [email];
    const rows = await pool.query(query, values);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      const sqlquery = `INSERT INTO user(email, password) VALUES (?, ?)`;
      const result = await pool.query(sqlquery, [email, encryptedPassword]);

      const sanitizedResult = sanitizeResult(result);
      res.status(200).json({ userId: sanitizedResult.insertId });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM user WHERE email=?`;
    const values = [email];
    const rows = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(401).send(`User with ${email} not found`);
    }

    const storedPassword = rows[0].password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).send("Incorrect password");
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ token });
    // // User authenticated successfully
    // res.status(200).json("You are logged in successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Extract token and verify user authentication
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Create lobby
    const querysql = "INSERT INTO lobbies (name, admin_id) VALUES (?, ?)";
    const values = [name, adminId];
    const result = await pool.query(querysql, values);

    // Return the ID of the newly created lobby
    res.status(201).json({ lobbyId: result.insertId });
  } catch (error) {
    console.error("Error creating lobby:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
