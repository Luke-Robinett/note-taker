const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 80;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

// Web app routes

app.get("/", function(req, res) {
 res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
 res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API routes

app.get("/api/notes", function(req, res) {
 const testJSON = [{
   "title": "To Do",
   "text": "Way too much to do!"
  }];

  res.json(testJSON);
});

app.listen(PORT, function() {
 console.log("App listening on PORT " + PORT);
});
