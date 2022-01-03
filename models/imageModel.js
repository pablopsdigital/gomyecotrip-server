'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    imageURL: { type: String },
    public_id: { type: String },
  },
  {
    timestamps: true,
  }
);

//Create model
const Image = mongoose.model('Image', imageSchema);

//Export model
module.exports = Image;
