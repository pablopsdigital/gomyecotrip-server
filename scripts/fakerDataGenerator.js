"use strict";

//Import modules
const faker = require("faker/locale/es");
const fs = require("fs");
var util = require("util");

//Import models
const ExperienceModel = require("../models/experienceModel");
const UserModel = require("../models/userModel");
const BookingModel = require("../models/bookingModel");

//Execute general function script
fakerLoadData().catch((err) => console.log("There was an error", err));

async function fakerLoadData() {
  await fakerUsers();
  await fakerExperiences();
  await fakerBookings();
}

//================================================================
//Create mock users in database
//================================================================
async function fakerUsers() {}

//================================================================
//Create mock experiences in database
//================================================================
const types = [
  "Art and culture",
  "Leisure",
  "Food and drink",
  "Sports",
  "Welfare",
  "Emblematic places",
  "Nature and the great outdoors",
];

const amenities = [
  "amenitie 1",
  "amenitie 2",
  "amenitie 3",
  "amenitie 4",
  "amenitie 5",
  "amenitie 6",
  "amenitie 7",
  "amenitie 8",
  "amenitie 9",
  "amenitie 10",
];

async function fakerExperiences() {
  var experiences = [];

  for (let id = 1; id <= 100; id++) {
    experiences.push({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      currentBookings: [],
      maxCount: faker.datatype.number({ min: 0, max: 5 }),
      // featuredImage: faker.image.unsplash(1500, 1500, 'sport'),
      // featuredImage: 'https://source.unsplash.com/random/1600x900/?activities',
      featuredImage: faker.image.imageUrl(),
      galleryImgs: [
        faker.image.sports(1500, 1500),
        faker.image.sports(1500, 1500),
        faker.image.sports(1500, 1500),
        faker.image.sports(1500, 1500),
      ],
      type: types.slice(0, Math.random() * (types.length - 1) + 1),
      hosted: "",
      address: faker.address.direction(),
      hasGroup: faker.datatype.boolean(),
      minPersonForGroup: faker.datatype.number({ min: 0, max: 15 }),
      phoneNumber: faker.phone.phoneNumber(),
      accessibility: faker.datatype.boolean(),
      ratesForPerson: {
        adults: faker.datatype.number({ min: 5, max: 100 }),
        kids: faker.datatype.number({ min: 5, max: 50 }),
        babies: faker.datatype.number({ min: 0, max: 5 }),
      },
      map: {
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
      },
      saleOff: faker.datatype.boolean(),
      isAds: faker.datatype.boolean(),
      amenities: amenities.slice(0, Math.random() * (amenities.length - 1) + 1),
      reviewStart: faker.datatype.number({ min: 0, max: 5 }),
      reviewCount: faker.datatype.number({ min: 0, max: 300 }),
    });
  }

  fs.writeFileSync(
    "./scripts/fakerData/experiences.js",
    `const data = { experiences: 
        ${util.inspect(experiences)}
    }; module.exports=data;`,
    "utf-8"
  );
}

//================================================================
//Create mock bookings in database
//================================================================
async function fakerBookings() {}
