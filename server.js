const express = require("express");
const path = require("path");
const fs = require("fs");

// Configure express
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Web app routes

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

// API routes

app.get("/api/notes", (req, res) => {
  console.log("API received a GET request.");
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) {
      console.log("Database file doesn't exist. It will be automatically created when the first note is entered and saved.");
      res.json({});
    } else {
      try {
        const notes = JSON.parse(data);
        console.log(`Responding with ${notes.length} note(s) from the database.`);
        res.json(notes);
      } catch {
        console.log("Database file doesn't contain any valid note data.");
        res.json({});
      }
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.log("API received a POST request");
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    let notes = [];
    let newId = 1;

    // Load any saved notes first
    try {
      notes = JSON.parse(data);

      // Auto increment new note by one based on value of last saved note
      newId = parseInt(notes[notes.length - 1].id) + 1;
      console.log(`Got ${notes.length} note(s) from database.`);
    } catch {
      console.log("Couldn't get data from database so starting with empty file.");
    }

    // Append new note to array
    const newNote = req.body;
    newNote.id = newId;
    notes.push(newNote);
    console.log(`Added new note:\nTitle: ${newNote.title}\nText: ${newNote.text}\nID: ${newNote.id}`);

    // Save array of notes to file
    fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), err => {
      if (err) {
        throw err;
      }
      console.log(`Successfully saved ${notes.length} note(s) to the database.`);

      // Respond with the newly added note
      res.json(newNote);
    })
  });
});

app.delete("/api/notes/*", (req, res) => {
  console.log("API received a DELETE request.");

  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) {
      console.log("Nothing deleted because no database file found.");
      return;
    }

    let deletedNote = {};
    try {
      const notes = JSON.parse(data);
      const id = parseInt(req.params[0]);
      let foundIndex = -1;

      notes.some((note, index) => {
        if (note.id === id) {
          foundIndex = index;
          deletedNote = note;
          return true;
        }
      });
      if (foundIndex >= 0) {
        notes.splice(foundIndex, 1);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Note deleted and database file updated.");
        });
      }
    } catch {
      console.log("Nothing deleted because couldn't find any valid note data in the database.");
    }

    res.json(deletedNote);
  });
});

// Start the server
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
