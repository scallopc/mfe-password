const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

function validatePassword(password) {
  const specialChars = "!@#$%^&*()-+";

  if (password.length < 9) return false;

  if (!/[0-9]/.test(password)) return false;

  if (!/[a-z]/.test(password)) return false;

  if (!/[A-Z]/.test(password)) return false;

  if (!password.split("").some((c) => specialChars.includes(c))) return false;

  const set = new Set(password);
  if (set.size !== password.length) return false;

  return true;
}

app.post("/validate-password", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Authorization header is required" });
  }

  if (auth !== "Bearer mocked-token-123") {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { password } = req.body;

  const valid = validatePassword(password);

  res.json({
    valid,
  });
});

app.listen(3002, () => {
  console.log("Password Service running on 3002");
});
