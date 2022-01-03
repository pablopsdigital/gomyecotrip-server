'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../../../middlewares/auth');
const { isAdmin, isHosted, isHostedOrAdmin } = require('../../../middlewares/checkUserRole');

const {
  getAllExperiences,
  getOneExperienceForId,
  getAllExperiencesForAdminAndHost,
  createExperience,
  updateExperience,
  deleteExperience,
  createReviewExperience,
} = require('../../../controllers/experienceController.js');

router.get('/', getAllExperiences);
router.get('/:id', getOneExperienceForId);
router.get('/hosted', isAuth, isHostedOrAdmin, getAllExperiencesForAdminAndHost);
router.post('/create', isAuth, isHostedOrAdmin, createExperience);
router.put('/update/:id', isAuth, isHostedOrAdmin, updateExperience);
router.delete('/delete/:id', isAuth, isAdmin, deleteExperience);
router.delete('/:id/reviews', isAuth, createReviewExperience);

module.exports = router;
