const express = require('express');
const { validationResult } = require('express-validator');
const validator = require('validator');
const Url = require('../models/Url');

const router = express.Router();

// @route     POST /api/v1/shorten
// @desc      Create short URL
router.post('/', async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url, customName } = req.body;

    // Validate longUrl
    if (!url || !validator.isURL(url)) {
      return res.status(400).json({ error: 'Please provide a valid long URL.' });
    }

    let existingURL;

    // Check if longUrl already exists
    existingURL = await Url.findOne({ originalUrl: url });
    if (existingURL) {
      return res.json({
        message: 'URL already exists',
        data: {
          shortUrl: existingURL.shortUrl,
        },
      });
    }

    // Validate customName if provided
    if (customName) {
      if (customName.length < 5 || !validator.isAlphanumeric(customName)) {
        return res.status(400).json({ error: 'Custom name must be at least 5 alphanumeric characters long.' });
      }

      const formattedCustomName = customName.replace(/\s+/g, '-'); // Replace spaces with dashes
      existingURL = await Url.findOne({ customName: formattedCustomName });

      if (existingURL) {
        return res.status(400).json({ error: 'Custom name already exists.' });
      }

      const newShortenedURL = new Url({
        customName: formattedCustomName,
        shortUrl: https://shortit/${formattedCustomName},
        originalUrl: url,
      });

      await newShortenedURL.save();

      return res.json({
        message: 'URL shortened successfully',
        data: {
          shortUrl: newShortenedURL.shortUrl,
        },
      });
    }

    // Generate random shortUrl
    let randomShortUrl = validator.isAlphanumeric(validator.escape(nanoid(5))) ? nanoid(5) : nanoid(6);
    existingURL = await Url.findOne({ shortUrl: randomShortUrl });

    // Ensure random shortUrl is unique
    while (existingURL) {
      randomShortUrl = validator.isAlphanumeric(validator.escape(nanoid(5))) ? nanoid(5) : nanoid(6);
      existingURL = await Url.findOne({ shortUrl: randomShortUrl });
    }

    const newShortenedURL = new Url({
      shortUrl: https://shortit/${randomShortUrl},
      originalUrl: url,
    });

    await newShortenedURL.save();

    return res.json({
      message: 'URL shortened successfully',
      data: {
        shortUrl: newShortenedURL.shortUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;