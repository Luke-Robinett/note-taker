const express = require("express");
const path = require("path");
const fs = require("fs");

// Configure express
const app = express();
const PORT = 80;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Web app routes

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

// API routes

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) {
      res.json({});
    } else {
      try {
        res.json(JSON.parse(data));
      } catch {
        res.json({});
      }
    }
  });
});

app.post("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    var notes;

    // Load any saved notes first
    try {
      notes = JSON.parse(data);
    } catch {
      // If no notes in file or file doesn't exist, start with empty array
      notes = [];
    }

    // Append new note to array
    notes.push(req.body);

    // Save array of notes to file
    fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        throw err;
        return;
      }
      console.log("File saved.");

      // Respond with the newly added note
      res.json(req.body);
    })
  });
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
