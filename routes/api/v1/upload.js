'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../../../middlewares/auth');
const multerUploadFile = require('../../../middlewares/multerFileConfigure');
const multerUploadFiles = require('../../../middlewares/multerFilesConfigure');
const { isAdmin, isHosted, isHostedOrAdmin } = require('../../../middlewares/checkUserRole');

const {
  uploadFileLocal,
  uploadFileCloudinary,
  uploadFileProfileCloudinary,
  uploadFilesCloudinary,
} = require('../../../controllers/uploadFilesController.js');

router.post('/file-local', isAuth, multerUploadFile, uploadFileLocal);
router.post('/file', isAuth, multerUploadFile, uploadFileCloudinary);
router.post('/file-profile', isAuth, multerUploadFile, uploadFileProfileCloudinary);
router.post('/files', isAuth, multerUploadFiles, uploadFilesCloudinary);

module.exports = router;
