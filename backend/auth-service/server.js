const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/oauth/token", (req, res) => {
  const { client_id, client_secret, grant_type } = req.body;

  if (
    client_id === "frontend" &&
    client_secret === "123" &&
    grant_type === "client_credentials"
  ) {
    return res.json({
      access_token: "mocked-token-123",
      token_type: "Bearer",
      expires_in: 3600,
    });
  }

  return res.status(401).json({
    error: "invalid_client",
  });
});

app.listen(3000, () => {
  console.log("Auth server running on port 3000");
});
