'use strict';

const cloudinary = require('cloudinary');

//Config for load .env files
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadsLocalFiles = (file, folfer) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.secure_url,
          id: result.public_id,
        });
      },
      {
        folder: 'gomyecotrip',
        use_filename: true,
        resourceType: 'auto',
      }
    );
  });
};

const uploadsLocalFileProfile = (file, folfer) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.secure_url,
          id: result.public_id,
        });
      },
      {
        folder: 'gomyecotrip/profiles',
        use_filename: true,
        resourceType: 'auto',
      }
    );
  });
};

module.exports = { uploadsLocalFiles, uploadsLocalFileProfile };
