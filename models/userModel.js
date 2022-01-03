'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    imageAvatar: { type: String, default: 'https://i.pravatar.cc/500' },
    isAdmin: { type: Boolean, default: false, required: true },
    isHosted: { type: Boolean, default: false, required: true },
    hosted: {
      name: { type: String },
      logo: { type: String },
      description: { type: String },
      reviewStart: { type: Number, default: 0, required: true },
      reviewCount: { type: Number, default: 0, required: true },
      speakLanguages: [String],
    },
    stripeAccountId: { type: String },
    stripeHosted: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);

//Create model
const User = mongoose.model('User', userSchema);

//Exports model
module.exports = User;
