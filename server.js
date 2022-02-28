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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"))
})


app.post('/api/notes', (req, res) => {
    const addedNote = req.body
    addedNote.id = Date.now()
    notes.push(addedNote)
    
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(notes)
    });
    res.sendFile(path.join(__dirname, "./public/notes.html"))

    
})

app.delete('/api/notes/:id', (req, res) => {

    const notes = fs.readFile("./db/db.json", (err, data)=>{
        let notesData = JSON.parse(data);
        let oneNote = notesData.find(noteId=>noteId.id === +(req.params.id))
        let indexOfOneNote = notesData.indexOf(oneNote)
        notesData.splice(indexOfOneNote, 1)
        
        fs.writeFile("./db/db.json", JSON.stringify(notesData), (err) => {
            if (err) throw err;
            res.json(notes)
        });
        res.sendFile(path.join(__dirname, "./public/notes.html"))
    });
    
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));