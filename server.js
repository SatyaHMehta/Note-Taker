
// The required dependensies. 
const express = require('express');
const notes = require('./db/db.json');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "./public")));

currentID = notes.length
// path to the homepage.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

// path to the notes page.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

// the path to the db requried for the notes page.
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"))
})

// Post method for adding the notes.
app.post('/api/notes', (req, res) => {
    // var to hold the info from the user's input
    const addedNote = req.body
    // adding a dynamic id to each notes
    addedNote.id = Date.now()
    // updating the notes object with new notes
    notes.push(addedNote)
    // updating the db file with the added notes
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(notes)
    });
    // sending the updated notes as a response.
    res.sendFile(path.join(__dirname, "./public/notes.html"))

    
})
/////////////////////////////////////////////// this is the bonus part of the hw. //////////////////

// the delete route to remove notes
app.delete('/api/notes/:id', (req, res) => {
    // lines 54-59 look up the db file info, matches the id with the input of the user, and splices that elemnt from the db to delete it. 
    const notes = fs.readFile("./db/db.json", (err, data)=>{
        let notesData = JSON.parse(data);
        let oneNote = notesData.find(noteId=>noteId.id === +(req.params.id))
        let indexOfOneNote = notesData.indexOf(oneNote)
        notesData.splice(indexOfOneNote, 1)
        // updates the db with the deleted note.
        fs.writeFile("./db/db.json", JSON.stringify(notesData), (err) => {
            if (err) throw err;
            res.json(notes)
        });
        // sends the updated file back.
        res.sendFile(path.join(__dirname, "./public/notes.html"))
    });
    
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));