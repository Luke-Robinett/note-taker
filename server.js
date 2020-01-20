const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 80;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Web app routes

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API routes

app.get("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname + "/db/db.json"), function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    const notes = JSON.parse(data);
    console.log(notes);
    res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname + "/db/db.json"), function (err, data) {
    let notes = [];
    if (data != null) {
      notes = JSON.parse(data);
    }
    notes.push(req.body);

    fs.writeFile(path.join(__dirname + "/db/db.json"), JSON.stringify(notes), function (err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("File saved.");
    });
  });
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
