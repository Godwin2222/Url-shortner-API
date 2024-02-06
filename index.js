const express = require('express');
const connectDB = require('./config/db');
const config = require('config');
const nanoid = require('nanoid');


const Url = require('./models/Url');
const { listen } = require('express/lib/application');

const app = express();


// Connect to database
connectDB();

app.use(express.json());

// @route     POST /api/v1/shorten
// @desc      Create short URL

app.post('/api/v1/shorten', async (req, res) => {
  try {
    const { url, customName } = req.body;

    // Validate longUrl
    if (!url) {
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
      if (customName.length < 5) {
        return res.status(400).json({ error: 'Custom name must be at least 5 characters long.' });
      }

      const formattedCustomName = customName.replace(/\s+/g, '-'); // Replace spaces with dashes
      existingURL = await Url.findOne({ customName: formattedCustomName });

      if (existingURL) {
        return res.status(400).json({ error: 'Custom name already exists.' });
      }

      const newShortenedURL = new ShortenedURL({
        customName: formattedCustomName,
        shortUrl: `https://shortit/${formattedCustomName}`,
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
    const randomShortUrl = nanoid(5);
    existingURL = await Url.findOne({ shortUrl: randomShortUrl });

    // Ensure random shortUrl is unique
    while (existingURL) {
      randomShortUrl = nanoid(5);
      existingURL = await Url.findOne({ shortUrl: randomShortUrl });
    }

    const newShortenedURL = new ShortenedURL({
      shortUrl: `https://shortit/${randomShortUrl}`,
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
  
 // @route     GET /api/v1/urls
// @desc      get all urls

app.get('/api/v1/urls', async (req, res) => {
  try {
    const allURLs = await Url.find({}, '-_id -__v'); // Exclude _id and __v fields
    if (allURLs.length === 0) {
      return res.json([]);
    }

    const formattedURLs = allURLs.map((url) => ({
      id: url.id,
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

app.get('/api/v1/urls/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    const url = await Url.findById(id, '-_id -__v'); // Exclude _id and __v fields

    if (!url) {
      return res.status(404).json({ error: 'URL not found.' });
    }

    const formattedURL = {
      id: url.id,
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

// @route     PUT /api/v1/urls/:id
// @desc      update a single URL

app.put('/api/v1/urls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customName, url } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    const existingURL = await Url.findById(id);

    if (!existingURL) {
      return res.status(404).json({ error: 'URL not found.' });
    }

    // Update customName and shortUrl if provided
    if (customName) {
      if (customName.length < 5) {
        return res.status(400).json({ error: 'Custom name must be at least 5 characters long.' });
      }

      const formattedCustomName = customName.replace(/\s+/g, '-'); // Replace spaces with dashes

      // Check if updated customName already exists
      const duplicateURL = await Url.findOne({ customName: formattedCustomName, _id: { $ne: id } });

      if (duplicateURL) {
        return res.status(400).json({ error: 'Custom name already exists.' });
      }

      existingURL.customName = formattedCustomName;
      existingURL.shortUrl = `https://shortit/${formattedCustomName}`;
    }

    // Update originalUrl if provided
    if (url) {
      // Validate the provided URL
      // You can use a library like 'valid-url' for more comprehensive URL validation
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({ error: 'Invalid URL format.' });
      }

      existingURL.originalUrl = url;
    }

    await existingURL.save();

    const updatedURL = {
      id: existingURL.id,
      customName: existingURL.customName,
      originalUrl: existingURL.originalUrl,
      shortUrl: existingURL.shortUrl,
      createdAt: existingURL.createdAt.toISOString(),
    };

    return res.json({
      message: 'URL updated successfully',
      data: updatedURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @route     DELETE /api/v1/urls/:id
// @desc      delete a single URL


app.delete('/api/v1/urls/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    const deletedURL = await Url.findByIdAndDelete(id);

    if (!deletedURL) {
      return res.status(404).json({ error: 'URL not found.' });
    }

    const deletedURLData = {
      id: deletedURL.id,
      customName: deletedURL.customName,
      originalUrl: deletedURL.originalUrl,
      shortUrl: deletedURL.shortUrl,
      createdAt: deletedURL.createdAt.toISOString(),
    };

    return res.json({
      message: 'URL deleted successfully',
      data: deletedURLData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5005;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));