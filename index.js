const express = require('express');
const connectDB = require('./config/db');
const shortenRoute = require('./routes/shorten');
const urlsRoute = require('./routes/urls');

const app = express();

// Connect to database
connectDB();

app.use(express.json());

// Routes
app.use('/api/v1/shorten', shortenRoute);
app.use('/api/v1/urls', urlsRoute);

const PORT = 5005;

app.listen(PORT, () => console.log(Server running on port ${PORT}));