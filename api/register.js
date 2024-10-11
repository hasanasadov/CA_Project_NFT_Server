const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../fake-data");
const app = express();

const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
const validateWithRegex = (text, pattern) => {
  return pattern.test(text);
};

app.post("/register", (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "Fields 'username', 'email' and 'password' are required!" });
    }
    if (!validateWithRegex(email, EMAIL_REGEX)) {
      return res.status(400).json({ error: "Email is not valid!" });
    }
    if (!validateWithRegex(password, PASSWORD_REGEX)) {
      return res.status(400).json({ error: "Password is not valid!" });
    }

    const isUsernameAlreadyUsed = users.some(
      (user) => user.username.toLowerCase().trim() === username.toLowerCase().trim()
    );

    if (isUsernameAlreadyUsed) {
      return res.status(400).json({ error: "Username is already used!" });
    }
    const isEmailAlreadyUsed = users.some(
      (user) => user.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (isEmailAlreadyUsed) {
      return res.status(400).json({ error: "Email is already used!" });
    }

    const newUser = {
      id: uuidv4(),
      email,
      username,
      password,
    };

    users.push(newUser);

    res.status(200).json({ ...newUser, password: undefined });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error! ${error}` });
  }
});

module.exports = app;
