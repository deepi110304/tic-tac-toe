const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public")); // serves HTML, CSS, JS
app.use(express.json());

app.post("/result", (req, res) => {
  const { result } = req.body;
  console.log("Game Result:", result);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
