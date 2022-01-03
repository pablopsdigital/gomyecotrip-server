'use strict';

const express = require('express');
const router = express.Router();
const isAuth = require('../../../middlewares/auth');
const { isAdmin, isHosted, isHostedOrAdmin } = require('../../../middlewares/checkUserRole');

const {
  getAllBookings,
  getAllBookingsForUser,
  getOneBookingForId,
  createBooking,
  changeBookingState,
  deleteBooking,
} = require('../../../controllers/bookingController.js');

router.get('/hosted', isAuth, isHostedOrAdmin, getAllBookings);
router.get('/user', isAuth, getAllBookingsForUser);
router.get('/:id', isAuth, getOneBookingForId);
router.post('/create', isAuth, createBooking);
router.put('/state', isAuth, isHostedOrAdmin, changeBookingState);
router.delete('/delete/:id', isAuth, isAdmin, deleteBooking);

module.exports = router;
