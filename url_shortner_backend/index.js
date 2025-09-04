const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let ud = {
  logID: "6a6bb882-bc66-444a-937c-dda1914c4adc",
  message: "log created successfully",
};

let shortcodes = {};

// Create short URL
app.post("/shorturls", (req, res) => {
  let { url, validityminutes, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({
      ...ud,
      error: "Missing required fields",
    });
  }

  if (!validityminutes) {
    validityminutes = 30; // default 30 mins
  }

  if (!shortcode) {
    shortcode = Math.random().toString(36).substring(2, 8);
  }

  if (shortcodes[shortcode]) {
    return res.status(409).json({
      ...ud,
      error: "Shortcode already in use",
    });
  }

  const creationdate = Date.now();
  const expirydate = creationdate + validityminutes * 60000;

  const expiryDateObj = new Date(expirydate);
  let expiryString = `expiry:${expiryDateObj.getFullYear()}-${String(
    expiryDateObj.getMonth() + 1
  ).padStart(2, "0")}-${String(expiryDateObj.getDate()).padStart(
    2,
    "0"
  )}T${String(expiryDateObj.getHours()).padStart(2, "0")}:${String(
    expiryDateObj.getMinutes()
  ).padStart(2, "0")}Z`;

  shortcodes[shortcode] = {
    url,
    validityminutes,
    clickcount: 0,
    creationdate,
    expirydate,
    expiryString,
  };

  let shortUrl = `http://localhost:3000/${shortcode}`;

  return res.json({
    ...ud,
    shortUrl,
    expiry: expiryString,
  });
});

// Redirect to original URL
app.get("/:shortcode", (req, res) => {
  let { shortcode } = req.params;

  if (!shortcodes[shortcode]) {
    return res.status(404).json({
      ...ud,
      error: "Shortcode not found",
    });
  }

  if (Date.now() > shortcodes[shortcode].expirydate) {
    delete shortcodes[shortcode];
    return res.status(410).json({
      ...ud,
      error: "Shortcode expired",
    });
  }

  shortcodes[shortcode].clickcount++;
  return res.redirect(shortcodes[shortcode].url);
});

// Get shortcode details
app.get("/shorturls/:shortcode", (req, res) => {
  let { shortcode } = req.params;

  if (!shortcodes[shortcode]) {
    return res.status(404).json({
      ...ud,
      error: "Shortcode not found",
    });
  }

  return res.json({
    ...ud,
    url: shortcodes[shortcode].url,
    clickcount: shortcodes[shortcode].clickcount,
    validityminutes: shortcodes[shortcode].validityminutes,
    creationdate: shortcodes[shortcode].creationdate,
    expirydate: shortcodes[shortcode].expirydate,
    expiryString: shortcodes[shortcode].expiryString,
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
