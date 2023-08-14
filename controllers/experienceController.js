'use strict';

const Experience = require('../models/experienceModel.js');
const expressAsyncHandler = require('express-async-handler');
const uploadCloudinary = require('../services/uploadCloudinary');
const fs = require('fs');
const cloudinary = require('cloudinary');

/**
 *
 */
const getAllExperiences = expressAsyncHandler(async (req, res, next) => {
  try {
    const hosted = req.query.hosted || '';
    const hostedFilter = hosted ? { hosted } : {};
    console.log(hostedFilter);

    // //Search database
    const experiences = await Experience.find({
      ...hostedFilter,
    })
      .populate('hosted', 'hosted.name hosted.logo')
      .sort({ createdAt: -1 });

    //Optimizer image response
    // TODO: Optimization images response
    // experiences.map((experience) => {
    //   experience.featuredImage = cloudinary.url(experience.featuredImage, {
    //     type: "fetch",
    //     transformation: [
    //       { width: "1000", crop: "scale" },
    //       { fetch_format: "auto" },
    //       { quality: "auto" },
    //       { secure: true },
    //       { resource_type: "image" },
    //       { flags: "lossy" },
    //       { dpr: "auto" },
    //     ],
    //   });
    // });

    //Send response
    res.status(200).json({ experiences });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of experiences.',
    });
    next(err);
  }
});

/**
 *
 */
const getAllExperiencesForAdminAndHost = expressAsyncHandler(async (req, res, next) => {
  try {
    const hosted = req.query.hosted || '';
    const hostedFilter = hosted ? { hosted } : {};
    console.log(hostedFilter);

    // //Search database
    const experiences = await Experience.find({
      ...hostedFilter,
    })
      .populate('hosted', 'hosted.name hosted.logo')
      .sort({ createdAt: -1 });

    //Optimizer image response
    experiences.map((experience) => {
      experience.featuredImage = cloudinary.url(experience.featuredImage, {
        type: 'fetch',
        transformation: [
          { width: '1000', crop: 'scale' },
          { fetch_format: 'auto' },
          { quality: 'auto' },
          { secure: true },
          { resource_type: 'image' },
          { flags: 'lossy' },
          { dpr: 'auto' },
        ],
      });
    });

    //Send response
    res.status(200).json({ experiences });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of experiences.',
    });
    next(err);
  }
});

/**
 *
 */
const getOneExperienceForId = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const _id = req.params.id;

    //Search database
    const experience = await Experience.findById({ _id }).populate('hosted');

    //Send no exist id
    if (!experience) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
      return;
    }
    //Send response
    res.status(200).json(experience);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while viewing the experience.',
    });
    next(err);
  }
});

/**
 *
 */
const createExperience = expressAsyncHandler(async (req, res, next) => {
  console.log('Req', req.body);
  try {
    //Read data request
    const experienceData = req.body;

    //===========================================================================
    //Search database
    //===========================================================================
    const experienceQuery = await Experience.exists({ name: req.body.name });

    //Send no exist id
    if (experienceQuery) {
      res.status(404).json({
        error: `There is already an experience with the same name.`,
      });
      return;
    }

    //===========================================================================
    // create experience object
    //===========================================================================
    const experience = new Experience({
      name: experienceData.name,
      description: experienceData.description,
      duration: experienceData.duration,
      maxCount: experienceData.maxCount,
      featuredImage: experienceData.featuredImage[0],
      galleryImgs: experienceData.galleryImgs,
      address: experienceData.address,
      type: experienceData.type,
      hosted: experienceData.hosted,
      ratesForPerson: {
        adults: experienceData.adultRate,
        kids: experienceData.kidRate,
        babies: experienceData.babieRate,
      },
      amenities: experienceData.amenities,
      reviewCount: experienceData.reviewCount || 0,
      reviewStart: experienceData.reviewStart || 0,
      phoneNumber: experienceData.phoneNumber || '',
    });

    //Save the new experience
    const createdExperience = await experience.save();

    //Send response
    res.status(201).json({ message: 'Experience Created', result: createdExperience });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while creating the experience.',
    });
    next(err);
  }
});

/**
 *
 */
const updateExperience = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const experienceId = req.params.id;
    const experienceData = req.body;
    console.log('ExperienceData', experienceData);

    //Search and update in database (filter, updateData)
    const experienceUpdateResult = await Experience.findByIdAndUpdate(
      { _id: experienceId },
      experienceData,
      {
        new: true, // Return final state
      }
    );

    //Send no exist id
    if (!experienceUpdateResult) {
      res.status(404).json({
        error: `The record with id: ${experienceId} does not exist`,
      });
      return;
    }

    //Send response
    res.status(200).json({
      message: 'Experience Updated',
      experience: experienceUpdateResult,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating the experience.',
    });
    next(err);
  }
});

/**
 *
 */
const deleteExperience = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const experienceId = req.params.id;

    //Search in database and delete if exist
    const experienceDelete = await Experience.findByIdAndDelete(experienceId);

    //Send no exist id
    if (!experienceDelete) {
      res.status(404).json({ error: `The record with id: ${experienceId} not found.` });
      return;
    }

    //Send responses
    res.status(200).json({
      message: 'Experience Deleted',
      experience: deleteExperience,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while the experience was being removed.',
    });
    next(err);
  }
});

/**
 *
 */
const createReviewExperience = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const experienceId = req.params.id;

    //Search in database if experience exist
    const experience = await Experience.findById(experienceId);

    //Send no exist id
    if (!experience) {
      res.status(400).json({ error: `The record with id: ${experienceId} not found.` });
      return;
    }

    //If exist but already submitted a review
    if (experience) {
      if (experience.reviews.find((review) => review.name === req.user.name)) {
        res.status(400).json({ error: `You already submitted a review for this experience` });
        return;
      }
    }

    //Create review
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    //Update data experience
    experience.reviews.push(review);
    experience.reviewCount = experience.reviews.length;
    experience.reviewStart =
      experience.reviews.reduce((a, c) => c.reviewStart + a, 0) / experience.reviews.length;
    const newReviewExperience = await experience.save();

    //Send responses
    res.status(200).json({
      message: 'Review experience create',
      review: newReviewExperience.reviews[newReviewExperience.reviews.length - 1],
    });
  } catch (err) {
    res.status(500).send({
      message: 'Experience Not Found',
    });
    next(err);
  }
});

module.exports = {
  getAllExperiences,
  getAllExperiencesForAdminAndHost,
  getOneExperienceForId,
  createExperience,
  updateExperience,
  deleteExperience,
  createReviewExperience,
};
