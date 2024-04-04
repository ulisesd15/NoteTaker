const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific tip
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No tip with that ID');
    });
});

// DELETE Route for a specific tip
notes.delete('/:note_id', async (req, res) => {
  const noteId = req.params.note_id;
  
  try {
    let data = await readFromFile('./db/db.json');
    let json = JSON.parse(data);

    // Make a new array of all notes except the one with the ID provided in the URL
    const result = json.filter((note) => note.note_id !== noteId);

    // Save that array to the filesystem
    await writeToFile('./db/db.json', result);

    // Respond to the DELETE request
    res.json(`Item ${noteId} has been deleted 🗑️`);
  } catch (err) {
    console.error(err);
    res.status(500).json('Internal Server Error');
  }
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text, } = req.body;

  if (req.body) {
    const newNote = {
        title,
        text,
        note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Tip added successfully`);
  } else {
    res.error('Error in adding tip');
  }
});

module.exports = notes;
