const express = require("express");
const { users } = require("../fake-data");
const app = express();

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "Fields 'username' and 'password' are required!" });
    }

    const user = users.find(
      (user) => user.password === password && user.username === username
    );

    if (!user) {
      return res.status(400).json({ error: "User not found! Wrong username or password." });
    }

    res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error! ${error}` });
  }
});

module.exports = app;
