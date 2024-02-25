const express = require('express');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Url = require('../models/Url');

const router = express.Router();

// @route     GET /api/v1/urls
// @desc      get all urls
router.get('/', async (req, res) => {
  try {
    const allURLs = await Url.find({}, '-__v'); // Exclude only __v field
    if (allURLs.length === 0) {
    return res.json([]);
    }
  }

    const formattedURLs = allURLs.map((url) => ({
      id: url._id,
      customName: url.customName,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt.toISOString(),
    }));

    return res.json(formattedURLs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route     GET /api/v1/urls/:id
// @desc      get single url
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    const url = await Url.findById(id, '-__v'); // Exclude only __v field

    if (!url) {
      return res.status(404).json({ error: 'URL not found.' });
    }

    const formattedURL = {
        id: url._id,
      customName: url.customName,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt.toISOString(),
    };

    return res.json(formattedURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;