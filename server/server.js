const express = require('express');
const cors = require('cors');
const app = express();
const port = 6000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/uploadimages', (req, res) => {
  const { leftImage, rightImage } = req.body;
  // Mock response for image upload
  res.json({ message: 'Images successfully uploaded!', leftImage, rightImage });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});