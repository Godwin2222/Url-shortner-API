const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

app.use(express.json());

app.use('/', require('./routes/index'));

const PORT = 5005;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));