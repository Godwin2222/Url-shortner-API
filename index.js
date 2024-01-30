const express = require('express');
const connectDB = require('./config/db');
const validator = require('validator');
const shortid = require('shortid');
const config = require('config');

const Url = require('./models/Url');
const { listen } = require('express/lib/application');

const app = express();


// Connect to database
connectDB();

app.use(express.json());

// @route     POST /api/v1/shorten
// @desc      Create short URL

app.post('/api/v1/shorten', async (req, res) => {
    let { customName , originalUrl } = req.body;
    const baseUrl = config.get('baseUrl');
  
    let shortUrl;
     // If customName is provided, validate it
     if (customName && validator.isLength(customName, { min: 5 })) {
        // Check if customName already exists
        const existingCustomName = await Url.findOne({ customName });
          if (existingCustomName) {
            return res.status(400).json({ error: 'Custom name already in use' });
          }

    try {
          // Create url code
          const urlCode = shortid.generate();
   
        // Check original Url
        if (validator.isURL(originalUrl)) {
          
            let url = await Url.findOne({ originalUrl });
  
            if (url) {
              return res.json({
                  message: 'url already exists',
                  url,
                });

            } else {
              shortUrl = customName
              ? baseUrl + '/' + customName.replace(/\s+/g, '-')
              : baseUrl + '/' + urlCode;
            }
          } else {
            res.status(401).json('Invalid originalUrl');
          }
          customName = customName.replace(/\s+/g, '-')  
        url = new Url({
          originalUrl,
          shortUrl,
          customName,
          urlCode,
          date: new Date()
        });
  
        await url.save();
        
  
        return res.json({
          message: 'URL shortened successfully',
          data: {
            shortUrl,
          },
        });

        
      } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }     
  }});
  
  // @route     GET /:name
// @desc      Redirect to long/original URL
  
  app.get('/:name', async (req, res) => {
 
    try {
      const url = await Url.findOne({ customName: req.params.name });
  
      if (url) {
        return res.redirect(url.originalUrl);
      } else {
        return res.status(404).json('No url found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  });

// @route     GET /:code
// @desc      Redirect to long/original URL
  
  app.get('/:code', async (req, res) => {
    try {
      const url = await Url.findOne({ urlCode: req.params.code });
  
      if (url) {
        return res.redirect(url.originalUrl);
      } else {
        return res.status(404).json('No url found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  });

// // Define Routes
// app.use('/', require('./routes/index'));
// app.use('/api/v1', require('./routes/url'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));