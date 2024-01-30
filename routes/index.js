// const express = require('express');
// const router = express.Router();

// const Url = require('../models/Url');

// // @route     GET /:code
// // @desc      Redirect to long/original URL
// router.get('/:code', async (req, res) => {
//   try {
//     const url = await Url.findOne({ urlCode: req.params.code });

//     if (url) {
//       return res.redirect(url.originalUrl);
//     } else {
//       return res.status(404).json('No url found');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json('Server error');
//   }
// });

// router.get('/:name', async (req, res) => {
 
//   try {
//     const url = await Url.findOne({ customName: req.params.name });

//     if (url) {
//       return res.redirect(url.originalUrl);
//     } else {
//       return res.status(404).json('No url found');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json('Server error');
//   }
// });


// module.exports = router;