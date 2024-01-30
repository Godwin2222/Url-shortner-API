// const express = require('express');
// const router = express.Router();
// const validator = require('validator');
// const shortid = require('shortid');
// const config = require('config');

// const Url = require('../models/Url');
// const { listen } = require('express/lib/application');

// // @route     POST /api/v1/shorten
// // @desc      Create short URL
// router.post('/shorten', async (req, res) => {
//   let { customName , originalUrl } = req.body;
//   const baseUrl = config.get('baseUrl');

//   let shortUrl;
//    // If customName is provided, validate it
//    if (customName && validator.isLength(customName, { min: 5 })) {
//       // Check if customName already exists
//       const existingCustomName = await Url.findOne({ customName });
//         if (existingCustomName) {
//           return res.status(400).json({ error: 'Custom name already in use' });
//         }
    
    
  
//   try {
//         // Create url code
//         const urlCode = shortid.generate();
 
//       // Check original Url
//       if (validator.isURL(originalUrl)) {
        
//           let url = await Url.findOne({ originalUrl });

//           if (url) {
//             return res.json({
//                 message: 'url already exists',
//                 url,
//                 // data: {
//                 //   shortUrl,
//                 // },
//               });
//             // res.json(url);
            

//           } else {
//             shortUrl = customName
//             ? baseUrl + '/' + customName.replace(/\s+/g, '-')
//             : baseUrl + '/' + urlCode;
//           }
//         } else {
//           res.status(401).json('Invalid originalUrl');
//         }
//         customName = customName.replace(/\s+/g, '-')  
//       url = new Url({
//         originalUrl,
//         shortUrl,
//         customName,
//         urlCode,
//         date: new Date()
//       });

//       await url.save();
      

//       return res.json({
//         message: 'URL shortened successfully',
//         data: {
//           shortUrl,
//         },
//       });

      

        
      
//     } catch (err) {
//   console.error(err);
//   res.status(500).json('Server error');
// }     
// }});

// module.exports = router;