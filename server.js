const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, notes) {
        if (err) throw err;
        res.json(JSON.parse(notes));
    });

});

app.post("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, notes) {
        if (err) throw err;

        console.log('req.body :>> ', req.body);
        const jsonNotes = JSON.parse(notes);

        req.body.id = uuidv4();

        jsonNotes.push(req.body);
        fs.writeFile("./db/db.json", JSON.stringify(jsonNotes), function (err) {
            if (err) throw err;
            res.json(jsonNotes)
        });
    })
})

app.delete("/api/notes/:id", function (req, res) {
    const id = req.params.id;

    fs.readFile("./db/db.json", "utf8", function (err, notes) {
        if (err) throw err;

        const jsonNotes = JSON.parse(notes);

        const updatedNotes = jsonNotes.filter(element => element.id !== id)

        fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), function (err) {
            if (err) throw err;
            res.json(updatedNotes)
        });
    });
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

