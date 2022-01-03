'use strict';

// Conection database
const dbConnection = require('../services/connectionBD_Mongo');

//Import models
const ExperienceModel = require('../models/experienceModel');
const UserModel = require('../models/userModel');
// const BookingModel = require('../models/bookingModel');

//Import data
const experiencesMockData = require('./fakerData/experiences');
const userMockData = require('./seedData/users');

main().catch((err) => console.log('There was an error', err));

async function main() {
  await initUsers();
  await initExperiences();
  await initBookings();
  dbConnection.close();
}

//================================================================
//Create mock users in database
//================================================================
async function initUsers() {
  // Delete possible users
  const deletedUsers = await UserModel.deleteMany();
  console.log(`Deleted ${deletedUsers.deletedCount} users.`);

  // Create mockData users
  const users = await UserModel.insertMany(userMockData.users);

  // Create mockData users
  console.log(`Create ${users.length} users.`);
}

//================================================================
//Create mock experiences in database
//================================================================
async function initExperiences() {
  // Delete possible experiences
  const deletedExperiences = await ExperienceModel.deleteMany();
  console.log(`Deleted ${deletedExperiences.deletedCount} experiences.`);

  //Search user id asociate experience
  const userHosted = await UserModel.find();

  //Asociate experience with user hosted id
  const experiencesWithHosted = experiencesMockData.experiences.map(
    (experience) => {
      experience.hosted = userHosted[0]._id;
      return experience;
    }
  );

  // Create mockData experiences
  const experiencesInsert = await ExperienceModel.insertMany(
    experiencesWithHosted
  );
  // console.log(`Create ${experiencesInsert.length} experiences.`);
}

//================================================================
//Create mock bookings in database
//================================================================
async function initBookings() {}
