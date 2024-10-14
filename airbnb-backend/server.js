// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');

const PORT = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);

app.get('/', (req, res) => {
    res.send('Airbnb Clone API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
