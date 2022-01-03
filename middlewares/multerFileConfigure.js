'use strict';

const path = require('path');
const multer = require('multer');
const util = require('util');

//Define save route and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const typesValidFilesFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/bmp' ||
    file.mimetype === 'image/tiff' ||
    file.mimetype === 'image/gif'
  ) {
    // Accept file
    cb(null, true);
  } else {
    // No accept file
    cb({ message: 'Unsupported file format' }, false);
  }
};

//create multer with new storage properties
const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: typesValidFilesFilter,
}).single('image');

module.exports = uploadFile;
