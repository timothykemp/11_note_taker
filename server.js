//Required utilities
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // Used for IDs on Notes

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
//=======================

// Return notes.html
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "./public/notes.html")));

// Return all saved notes as json
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, notes) => {
        if (err) throw err;
        res.json(JSON.parse(notes));
    });
});

// Receive new note, save to request body, add to json file, return new note
app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, notes) => {
        if (err) throw err;

        const jsonNotes = JSON.parse(notes);

        req.body.id = uuidv4();
        jsonNotes.push(req.body);

        fs.writeFile("./db/db.json", JSON.stringify(jsonNotes), (err) => {
            if (err) throw err;
            res.json(jsonNotes)
        });
    })
})

// Delete selected note by ID from json, rewrite json file
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile("./db/db.json", "utf8", (err, notes) => {
        if (err) throw err;

        const jsonNotes = JSON.parse(notes);
        const updatedNotes = jsonNotes.filter(element => element.id !== id)

        fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
            if (err) throw err;
            res.json(updatedNotes)
        });
    });
})

// Return index.html for any other path
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "./public/index.html")));

// Server listener
app.listen(PORT, () => console.log("App listening on PORT " + PORT));

