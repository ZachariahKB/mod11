const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON data
app.use(express.json());

// Serve notes.html for /notes route
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/notes.html');
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(__dirname + '/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
  fs.readFile(__dirname + '/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const notes = JSON.parse(data);
    const newNote = req.body;
    // Generate a unique id (You can use UUID or any other package)
    newNote.id = Math.random().toString(36).substr(2, 9);
    notes.push(newNote);
    fs.writeFile(__dirname + '/db.json', JSON.stringify(notes), err => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});