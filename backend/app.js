const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
// Endpoint to get a random paragraph
app.get('/api/paragraphs/random', (req, res) => {
  db.get("SELECT content FROM paragraphs ORDER BY RANDOM() LIMIT 1", (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ paragraph: row ? row.content : '' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
