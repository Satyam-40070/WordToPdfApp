const express = require('express');
const multer = require('multer');
const {convertToPdf} = require('../Controllers/pdfConverter');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname);
    }
  })
  
  const upload = multer({ storage: storage });

router.post('/convert',upload.single('file') , convertToPdf);

module.exports = router;