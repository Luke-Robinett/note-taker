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
  console.log("Received POST request");
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    let notes = [];
    let newId = 1;

    // Load any saved notes first
    try {
      notes= JSON.parse(data);
      newId = parseInt(notes[notes.length - 1].id) + 1;
      console.log(`Got ${notes.length} notes from database.`);
    } catch(err) {
      // If no notes in file or file doesn't exist, start with empty array
      notes = [];
      console.log(err.message);
      console.log("Couldn't get data from database so starting with empty file.");
    }

    // Append new note to array
    const newNote = req.body;
    newNote.id = newId;
    notes.push(newNote);
    console.log(`Added new note:\n${newNote}`);

    // Save array of notes to file
    fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        throw err;
      }
      console.log(`Successfully saved ${notes.length} notes to the database.`);

      // Respond with the newly added note
      res.json(newNote);
    })
  });
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
