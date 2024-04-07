const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// DELETE Route for deleting a note by ID
app.delete('/db/notes/:id', (req, res) => {
  const noteId = req.params.id; // Get the ID of the note to delete

  // Logic to delete the note from the database or file
  // For example, you can use fs module to read the db.json file, remove the note with the given ID, and then rewrite the file

  res.json({ message: `Note with ID ${noteId} has been deleted successfully` });
});

// Wildcard route to direct users to a 404 page  // do this last because if not, it will run before the other conditions are met

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/note.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
