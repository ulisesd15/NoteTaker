const notes = require('express').Router();

// const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {  
  readFromFile,   
  readAndAppend,   
  writeToFile, 
} = require('../helpers/fsUtils.js');


// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
// notes.get('/:note_id', (req, res) => {
//   const noteId = req.params.note_id;
//   readFromFile('../db/db.json')
//     .then((data) => JSON.parse(data))
//     .then((json) => {
//       const result = json.filter((note) => note.note_id === noteId); 
//       return result.length > 0
//         ? res.json(result)
//         : res.json('No note with that ID');
//     });
// });
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
          const result = json.find((note) => note.note_id === noteId);
          return result ? res.send(result) : res.status(404).send('Note not found');
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Server Error');
      });
});
// DELETE Route for a specific tip
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  console.log('delete req. received')
  readFromFile('../db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);

      // Save that array to the filesystem
      writeToFile('../db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
        title,
        text,
        note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding mpte');
  }
});

module.exports = notes;
