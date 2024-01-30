const mongoose = require('mongoose');

const shortenedURLSchema = new mongoose.Schema({
  customName: {
    type: String,
    unique: true, // Ensure custom names are unique
    sparse: true, // Allow null (empty) values for custom names
  },
  urlCode: {
    type: String,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    // Optional: On this first iteration, add it to the model, but ignore this field
  },
});

module.exports = mongoose.model('Url', shortenedURLSchema);