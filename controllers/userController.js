'use strict';

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../services/generateTokenJWT');
const expressAsyncHandler = require('express-async-handler');
const { sendEmailSignUp } = require('../services/sendEmails');

/**
 *
 */
const signUpUser = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const email = req.body.email;
    const userDataBody = req.body;

    //Search email in database
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(404).json({
        error: `This email already exists.Try other email`,
      });
      return;
    } else {
      userDataBody.password = await bcrypt.hash(userDataBody.password, 10);
      const user = await User.create(userDataBody);

      //Send email
      sendEmailSignUp(user);

      //Send response
      res.status(200).json({
        message: 'User Signup',
        userInfo: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          imageAvatar: user.imageAvatar,
          isAdmin: user.isAdmin,
          isHosted: user.isHosted,
          token: generateToken(user),
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while creating the user.',
    });
    next(err);
  }
});

/**
 *
 */
const signInUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({
          message: 'User Signin',
          userInfo: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageAvatar: user.imageAvatar,
            isAdmin: user.isAdmin,
            isHosted: user.isHosted,
            token: generateToken(user),
          },
        });
        return;
      } else {
        res.status(404).json({
          error: `Invalid password`,
        });
      }
    } else {
      res.status(404).json({
        error: `Invalid email or password`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while signin the user.',
    });
    next(err);
  }
});

/**
 *
 */
const getAllUsers = expressAsyncHandler(async (req, res, next) => {
  try {
    //Search database
    const users = await User.find({});

    //Send response
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of users.',
    });
    next(err);
  }
});

/**
 *
 */
const getOneUserForId = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const _id = req.params.id;

    //Search database
    const user = await User.findById({ _id });

    //Send no exist id
    if (!user) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
    } else {
      //Send response
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while return de users.',
    });
    next(err);
  }
});

/**
 *
 */
const updateUserProfile = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const userId = req.params.id;
    console.log('uSER:', req.params.id);
    console.log('Params:', req.body);

    //Check if exist user in database
    const user = await User.findById(userId);

    //Is user exist extract data body
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.imageAvatar = req.body.imageAvatar || user.imageAvatar;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 10);
      }

      //Save in database
      const userDB = await user.save();

      res.status(200).json({
        message: 'User Updated',
        userInfo: {
          _id: userDB._id,
          firstName: userDB.firstName,
          lastName: userDB.lastName,
          email: userDB.email,
          imageAvatar: userDB.imageAvatar,
          isAdmin: userDB.isAdmin,
          isHosted: userDB.isHosted,
          token: generateToken(user),
        },
      });
    } else {
      res.status(404).json({
        error: `The record with id: ${userId} does not exist`,
      });
      return;
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating profile.',
    });
    next(err);
  }
});

/**
 *
 */
const updateHostProfile = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const userId = req.params.id;
    console.log('uSER:', req.params.id);
    console.log('Params:', req.body);

    //Check if exist user in database
    const user = await User.findById(userId);

    //Is user exist extract data body
    if (user) {
      if (user.isHosted) {
        user.hosted.name = req.body.hostName || user.hosted.name;
        user.hosted.logo = req.body.hostLogo || user.hosted.logo;
        user.hosted.description = req.body.hostDescription || user.hosted.description;
        user.hosted.speakLanguages = req.body.hostSpeakLanguages || user.hosted.speakLanguages;
      }

      //Save in database
      const userDB = await user.save();

      res.status(200).json({
        message: 'Hosted info Updated',
        userInfo: userDB,
      });
    } else {
      res.status(404).json({
        error: `The record with id: ${userId} does not exist`,
      });
      return;
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating profile.',
    });
    next(err);
  }
});

/**
 *
 */
const updateUser = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request and search user in database
    const userId = req.params.id;
    const user = await User.findById(userId);

    //Send exist id
    if (user) {
      //Trasnform data
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.isHosted = Boolean(req.body.isHosted);
      user.isAdmin = Boolean(req.body.isAdmin);

      //Sabe user
      const updatedUser = await user.save();

      //Send response
      res.status(200).json({
        message: 'User Updated',
        user: updatedUser,
      });
    } else {
      res.status(404).json({
        error: `The user with id: ${userId} does not exist`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating the user.',
    });
    next(err);
  }
});

/**
 *
 */
const deleteUser = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const userId = req.params.id;

    //Search in database and delete if exist
    const user = await User.findById(userId);

    //It's not possible to remove the administrator
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).json({ error: 'Can Not Delete Admin User' });
        return;
      }
      //Remove user
      const deleteUser = await user.deleteOne();
      res.status(200).json({ message: 'User Deleted', user: deleteUser });
    } else {
      //If user no found
      res.status(404).json({
        error: `The record with id: ${userId} does not exist`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while the user was being removed.',
    });
    next(err);
  }
});

module.exports = {
  signUpUser,
  signInUser,
  getAllUsers,
  getOneUserForId,
  updateUserProfile,
  updateHostProfile,
  updateUser,
  deleteUser,
};
