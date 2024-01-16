require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let urlDb = {};
let counter = 1;

app.post("/api/shorturl", (req, res) => {
  let url = req.body.url;
  let urlObj = new URL(url);

  dns.lookup(urlObj.hostname, (err, address) => {
    if (!address) {
      return res.json({ error: "invalid url" });
    }

    let shortUrl = counter++;
    urlDb[shortUrl] = url;

    res.json({ original_url: url, short_url: shortUrl });
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  let shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl) || !urlDb[shortUrl]) {
    return res.json({ error: "invalid short_url" });
  }

  res.redirect(urlDb[shortUrl]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
