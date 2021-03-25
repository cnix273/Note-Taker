// Dependencies
// =============================================================
const fs = require('fs');
const path = require('path');

module.exports = app => {
    // Setup notes variable
    fs.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        const notes = JSON.parse(data);

        //updates json file when note is added or deleted
        function updateDb() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

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
            return console.log("Note has been added! Note id: " + newNote.title);
        });

        // Retrieves note using id
        app.get("/api/notes/:id", function(req,res) {
            res.json(notes[req.params.id]);
        });

        // Deletes note using id
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Note has been deleted! Note id: "  + req.params.id);
        });

        // VIEW ROUTES
        // ========================================================

        // Display index.html when any route is accessed
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        // Display notes.html when /notes route is accessed
        app.get('/notes', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

    });

}