const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Make sure this doesn't conflict with your React app's port

app.use(cors());
app.use(express.json());

// Mock data 
const districts = [
  { id: '1', name: 'Mumbai' },
  { id: '2', name: 'Delhi' },
  { id: '3', name: 'Bangalore' },
];

const constituencies = {
  '1': [
    { id: '101', name: 'Mumbai North' },
    { id: '102', name: 'Mumbai South' },
  ],
  '2': [
    { id: '201', name: 'New Delhi' },
    { id: '202', name: 'South Delhi' },
  ],
  '3': [
    { id: '301', name: 'Bangalore North' },
    { id: '302', name: 'Bangalore South' },
  ],
};

// GET /api/districts
app.get('/api/districts', (req, res) => {
  res.json(districts);
});

// GET /api/constituencies
app.get('/api/constituencies', (req, res) => {
  const districtId = req.query.district;
  if (districtId && constituencies[districtId]) {
    res.json(constituencies[districtId]);
  } else {
    res.status(400).json({ error: 'Invalid district ID' });
  }
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});