const express = require('express');
const router = express.Router();

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/urls', async (req, res) => {
  res.send('Hello World!');
});

module.exports = router;