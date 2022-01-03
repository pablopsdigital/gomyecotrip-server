'use strict';

const Booking = require('../models/bookingModel.js');
const Experience = require('../models/experienceModel.js');
const expressAsyncHandler = require('express-async-handler');
const moment = require('moment');

/**
 *
 */
const getAllBookings = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const hosted = req.query.hosted || '';
    const hostedFilter = hosted ? { hosted } : {};

    //Search database
    const bookings = await Booking.find({ ...hostedFilter })
      .populate(['user', 'experience'])
      .sort({ createdAt: -1 });

    //Send response
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of bookings.',
    });
    next(err);
  }
});

/**
 *
 */
const getAllBookingsForUser = expressAsyncHandler(async (req, res, next) => {
  try {
    //Search database
    const bookings = await Booking.find({ user: req.user._id })
      .populate(['user', 'experience'])
      .sort({ createdAt: -1 });
    //Send response
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of bookings.',
    });
    next(err);
  }
});

/**
 *
 */
const getOneBookingForId = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const _id = req.params.id;

    //Search database
    const bookingQuery = await Booking.findById({ _id }).populate(['user', 'experience']);

    //Send no exist id
    if (!bookingQuery) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
      return;
    }
    //Send response
    res.status(200).json(bookingQuery);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while viewing the booking.',
    });
    next(err);
  }
});

/**
 *
 */
const createBooking = expressAsyncHandler(async (req, res, next) => {
  //Implement in stripeController
  // try {
  //   //Read params request
  //   const {
  //     experience,
  //     user,
  //     hosted,
  //     location,
  //     date,
  //     hour,
  //     priceAdults,
  //     quantityAdults,
  //     priceKids,
  //     quantityKids,
  //     priceBabies,
  //     quantityBabies,
  //     totalPayAmount,
  //     paymentMethod,
  //     state,
  //   } = req.body;
  //   // New booking (experience and user only id, no object complete)
  //   const newBooking = new Booking({
  //     experience,
  //     user,
  //     hosted,
  //     location,
  //     date: moment(date).format('MM-DD-YYYY'),
  //     hour,
  //     priceAdults,
  //     quantityAdults,
  //     priceKids,
  //     quantityKids,
  //     priceBabies,
  //     quantityBabies,
  //     totalPayAmount,
  //     paymentMethod,
  //     state,
  //     payTransactionResult: {
  //       id: '111',
  //       status: 'complete',
  //       update_time: 'sdfd',
  //       email_address: 'test@test.com',
  //     },
  //   });
  //   //Save the new booking
  //   const createdBooking = await newBooking.save();
  //   //=================================================
  //   //Update bookings in experience availability
  //   //=================================================
  //   //Search experience
  //   const experienceUpdate = await Experience.findOne({ _id: experience });
  //   if (!experienceUpdate) {
  //     res.status(404).json({
  //       error: `The record with id: ${experience} does not exist`,
  //     });
  //     return;
  //   }
  //   experienceUpdate.currentBookings.push({
  //     bookingId: createdBooking._id,
  //     date: moment(date).format('DD-MM-YYYY'),
  //     hour: hour,
  //     quantityAdults: quantityAdults,
  //     quantityKids: quantityKids,
  //     quantityBabies: quantityBabies,
  //     user: user,
  //   });
  //   await experienceUpdate.save();
  //   //Send response
  //   res.status(201).json({
  //     message: 'Booking Created',
  //     result: createdBooking,
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: 'An error occurred while trying to create the booking.',
  //   });
  //   next(err);
  // }
});

/**
 *
 */
const changeBookingState = expressAsyncHandler(async (req, res, next) => {
  console.log('Booking:', req.body.id);
  try {
    //Read params request
    const bookingId = req.body.id;
    const bookingState = req.body.state;

    //Search in database
    const bookingQuery = await Booking.findById({ _id: bookingId });

    //Send no exist id
    if (!bookingQuery) {
      res.status(404).json({
        error: `The record with id: ${bookingId} does not exist`,
      });
      return;
    }

    if (bookingQuery.state === 'completed') {
      res.status(404).json({
        error: `The booking has complete.`,
      });
      return;
    }

    //Send response
    bookingQuery.state = bookingState.state;
    bookingQuery.changeState = Date.now();

    //Update in database
    const updatedBooking = await bookingQuery.save();

    //Send response
    res.status(200).json({
      message: 'Booking Updated',
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating the booking.',
    });
    next(err);
  }
});

/**
 *
 */
const deleteBooking = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read params request
    const bookingId = req.params.id;

    //Search in database and delete if exist
    const bookingDelete = await Booking.findByIdAndDelete(bookingId);

    //Send no exist id
    if (!bookingDelete) {
      res.status(404).json({ error: `The record with id: ${bookingId} not found.` });
      return;
    }

    //Send responses
    res.status(200).json({
      message: 'Booking Deleted',
      booking: bookingDelete,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while the experience was being removed.',
    });
    next(err);
  }
});

module.exports = {
  getAllBookings,
  getAllBookingsForUser,
  getOneBookingForId,
  createBooking,
  changeBookingState,
  deleteBooking,
};
