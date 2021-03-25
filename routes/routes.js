// Dependencies
// =============================================================
const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Setup notes variable
    fs.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        // API ROUTES
        // ========================================================
    
        // Setting up the /api/notes get route
        app.get("/api/notes", function(req, res) {
            res.json(notes);
        });

        // Setting up the /api/notes post route
        app.post("/api/notes", function(req, res) {
            let newNote = req.body;
            notes.push(newNote);
            updateDb();
            return console.log("Note added! Note id: "+newNote.title);
        });

        // Retrieve note using id
        app.get("/api/notes/:id", function(req, res) {
            // display json for the notes array indices of the provided id
            res.json(notes[req.params.id]);
        });

        // Delete note using id
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Note deleted! Note id: "+req.params.id);
        });

        // VIEW ROUTES
        // ========================================================

        // Display notes.html when accessing /notes
        app.get('/notes', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });
        
        // Display index.html when accessing any route other than notes
        app.get('*', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        // Updates json file when note is added or deleted
        function updateDb() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

    });

}