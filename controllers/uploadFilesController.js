'use strict';

const Experience = require('../models/experienceModel.js');
const expressAsyncHandler = require('express-async-handler');
const uploadCloudinary = require('../services/uploadCloudinary');
const fs = require('fs');
const cloudinary = require('cloudinary');

/**
 *
 */
const uploadFileLocal = expressAsyncHandler(async (req, res, next) => {
  try {
    res.status(201).json(`${req.file.path}`);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while upload the file.',
    });
    next(err);
  }
});

/**
 *
 */
const uploadFileCloudinary = expressAsyncHandler(async (req, res, next) => {
  try {
    //Send to cloudinary
    if (req.file.path) {
      const newPath = await uploadCloudinary.uploadsLocalFiles(req.file.path);
      fs.unlinkSync(req.file.path);
      res.status(201).json(newPath);
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while upload the file.',
    });
    next(err);
  }
});

// uploadsLocalFileProfile;
const uploadFileProfileCloudinary = expressAsyncHandler(async (req, res, next) => {
  try {
    //Send to cloudinary
    if (req.file.path) {
      const newPath = await uploadCloudinary.uploadsLocalFileProfile(req.file.path);
      fs.unlinkSync(req.file.path);
      res.status(201).json(newPath);
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while upload the file.',
    });
    next(err);
  }
});

/**
 *
 */
const uploadFilesCloudinary = expressAsyncHandler(async (req, res, next) => {
  try {
    console.log('Texto: ', req.body.text);
    console.log('image: ', req.files);

    //Read gallery images files in uploads directory and send to cloudinary
    const urlsGallery = [];
    if (req.files) {
      for (const file of req.files) {
        const newPath = await uploadCloudinary.uploadsLocalFiles(file.path);
        urlsGallery.push(newPath);
        fs.unlinkSync(file.path);
      }
    }

    res.status(201).json(urlsGallery);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while upload the file.',
    });
    next(err);
  }
});

module.exports = {
  uploadFileLocal,
  uploadFileCloudinary,
  uploadFileProfileCloudinary,
  uploadFilesCloudinary,
};
