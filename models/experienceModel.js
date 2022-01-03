'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const experienceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    // dirationInHours: { type: Number, required: true, default: 1 },
    currentBookings: [],
    duration: { type: Number, required: true, default: 1 },
    maxCount: { type: Number, required: true },
    featuredImage: { type: String, required: true },
    galleryImgs: [],
    type: {
      type: [String],
      enum: [
        'Art and culture',
        'Leisure',
        'Food and drink',
        'Sports',
        'Welfare',
        'Emblematic places',
        'Nature and the great outdoors',
      ],
      default: ['uncategorized'],
    },
    hosted: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    hasGroup: { type: Boolean, default: false },
    minPersonForGroup: { type: Number, default: 10 },
    phoneNumber: { type: String, default: '' },
    accessibility: { type: Boolean, default: false },
    ratesForPerson: {
      adults: { type: Number, required: true },
      kids: { type: Number, required: true },
      babies: { type: Number, required: true },
    },
    address: {},
    saleOff: { type: Boolean, default: false },
    isAds: { type: Boolean, default: false },
    amenities: {
      type: [String],
      enum: [
        'amenitie 1',
        'amenitie 2',
        'amenitie 3',
        'amenitie 4',
        'amenitie 5',
        'amenitie 6',
        'amenitie 7',
        'amenitie 8',
        'amenitie 9',
        'amenitie 10',
      ],
    },
    reviewStart: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

//Create model
const Experience = mongoose.model('Experience', experienceSchema);

//Export model
module.exports = Experience;
