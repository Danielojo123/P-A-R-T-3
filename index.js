const express = require('express');
const morgan = require('morgan');
const cors = require('cors');  // Import cors module
const app = express();
const PORT = 3002;

// Define a custom token for Morgan to log the request body in JSON format
morgan.token('req-body-json', (req) => JSON.stringify(req.body));

// Configure Morgan to log messages including the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body-json'));

app.use(cors());  // Use cors middleware
app.use(express.json());
let phonebookEntries = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(phonebookEntries);
});

app.post('/api/persons', (req, res) => {
  const newEntry = req.body;

  // Check for missing name or number
  if (!newEntry.name || !newEntry.number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  // Check if the name already exists in the phonebook
  const existingEntry = phonebookEntries.find(entry => entry.name === newEntry.name);
  if (existingEntry) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  newEntry.id = generateId(); // Generate a unique ID for the new entry
  phonebookEntries.push(newEntry);
  res.status(201).json(newEntry);
});

app.get('/info', (req, res) => {
  const currentTime = new Date();
  const formattedTime = currentTime.toISOString();

  const info = `
    <p>The phonebook has info for ${phonebookEntries.length} people.</p>
    <p>Request received at: ${formattedTime}</p>
  `;

  res.send(info);
});

app.get('/api/persons/:id', (req, res) => {
  const idToFind = parseInt(req.params.id);
  const entry = phonebookEntries.find(entry => entry.id === idToFind);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  phonebookEntries = phonebookEntries.filter(entry => entry.id !== idToDelete);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to generate a unique ID
function generateId() {
  // Generate a random number in a large range to minimize the likelihood of duplicates
  return Math.floor(Math.random() * 1000000);
}
