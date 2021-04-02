// Dependencies
// =============================================================
const express = require("express");
const fs = require('fs');
const path = require('path');
const db = require("./db/db")

// Sets up the Express App
// =============================================================
const app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API Routes
// =============================================================

// Setting up the /api/notes get route
app.get("/api/notes", (req, res) => {
    // Render notes from db
    res.json(db);
});

let newId = 1;

// Setting up the /api/notes post route
app.post("/api/notes", (req, res) => {
    // Set the length of the db to index
    let index = db.length;
    // If the length isn't 0, set the index to one greater than the last note's index
    if (index >= 1) {
        newId = db[index-1].id + 1;
        console.log(newId)
    }
    // If there are no notes in the db, set the id to 1
    else if (index = 0) {
        newId = 1;
    }

    // Set the new note to req.body
    let newNote = req.body;
    // Set the id of the new note to the new id determined above
    newNote.id = newId
    // Push the new note to db
    db.push(newNote);

    // Rewrite the notes to the db.json file
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
        if (err) {
            return (err);
        } else {
            console.log("Your note was successfully saved!");
        }
    });
    // Render notes db on page
    res.json(db);
})

// Delete note using unique id
app.delete("/api/notes/:id", function (req, res) {
    // For loop to find note with the unique id equal to req.params.id
    for (let i = 0; i < db.length; i++) {
        if (db[i].id == req.params.id) {
            // Splice single note with the given id
            db.splice(i, 1);
            break;
        }
    }

    // Rewrite the notes to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(db), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was successfully deleted!");
        }
    });
    // Render notes db on page
    res.json(db);
});

// HTML Routes
// =============================================================

// Display notes.html when accessing /notes route
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// Displays index.html when accessing / route
app.get("/", function(req, res) {
    res.json(path.join(__dirname, "public/index.html"));
  });
  

// Display index.html when accessing all other routes
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});