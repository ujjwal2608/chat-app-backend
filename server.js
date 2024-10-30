// Import Express
import express from 'express';
const app = express();

// Define the port
const PORT = 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to my Express server!');
});

// Custom route
app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
