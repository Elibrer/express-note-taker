const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile} = require('../helpers/fsUtils');
const fgWhite = '\x1b[37m';
const fgRed = '\x1b[31m';
const fgYellow = '\x1b[33m';

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => 
        res.json(JSON.parse(data))
    );
}
);

notes.post('/', (req, res) => {
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success 🚀',
            body: newNote,
        }

        res.json(response);

    } else {
        res.error('Error in adding note');
    }
}
);

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((data) => {
            // console.log(data);
            const dbTitle = data.find((note) => note.id === noteId);
        
            const updatedDb = data.filter((note) => note.id !== noteId);

            writeToFile('./db/db.json', updatedDb);

            res.json(`Item ${dbTitle.title} has been deleted from db.json database with unique id ${noteId}.`);
            console.log(fgWhite + `Item ` + fgRed + `${dbTitle.title}` + fgWhite + ` has been deleted from db.json database with unique id ` + fgYellow + `${noteId}` + fgWhite + `.`);

        }
        );
}
);


module.exports = notes;