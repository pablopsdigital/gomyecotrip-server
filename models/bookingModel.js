'use strict';

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    location: {},
    date: { type: String, required: true },
    hour: { type: String, required: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hosted: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    priceAdults: { type: Number, required: true, default: 0 },
    quantityAdults: { type: Number, required: true, default: 0 },
    priceKids: { type: Number, required: true, default: 0 },
    quantityKids: { type: Number, required: true, default: 0 },
    priceBabies: { type: Number, required: true, default: 0 },
    quantityBabies: { type: Number, required: true, default: 0 },
    totalPayAmount: { type: Number, required: true, default: 0 },

    paymentMethod: { type: String, required: true },
    payTransactionResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    state: { type: String, default: 'booked' },
  },
  {
    timestamps: true,
  }
);

//Create model
const Booking = mongoose.model('Booking', bookingSchema);

//Export model
module.exports = Booking;
