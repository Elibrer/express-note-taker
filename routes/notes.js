const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile} = require('../helpers/fsUtils');

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
    //res.send('Delete note');
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((data) => {
            // console.log(data);
            const updatedDb = data.filter((note) => note.id !== noteId);

            writeToFile('./db/db.json', updatedDb);

            res.json(`Item ${noteId} has been deleted 🗑️`);

            console.log(`Item ${noteId} has been deleted 🗑️`);

        }
        );
}
);


module.exports = notes;