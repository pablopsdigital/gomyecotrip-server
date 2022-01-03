'use strict';
const expressAsyncHandler = require('express-async-handler');
const Experience = require('../models/experienceModel.js');
const User = require('../models/userModel.js');
const Booking = require('../models/bookingModel.js');
const moment = require('moment');

const Stripe = require('stripe');

//Config for load .env files
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

//Create stripe object
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 *
 */
const getStripeSessionId = expressAsyncHandler(async (req, res, next) => {
  try {
    //Read info
    // console.log('UserInfo', req.body.userId);
    // console.log('Experiencie', req.body.experienceId);
    // console.log('BookingSelect', req.body.bookingDetails);

    const userBuyId = req.body.userId;
    const experienceId = req.body.experienceId;
    const bookingDetails = req.body.bookingDetails;

    //Find experience in database
    const experience = await Experience.findById(experienceId).exec();
    // console.log('Experience', experience);

    //Charge a fee aplication
    // const fee = (item.price * 20) / 100;

    const finalAmout = () => {
      return (
        experience.ratesForPerson.adults * bookingDetails.quantityAdults +
        experience.ratesForPerson.kids * bookingDetails.quantityKids +
        experience.ratesForPerson.babies * bookingDetails.quantityBabies
      );
    };

    // console.log('Cantidad =========', finalAmout());

    //==============================================================
    //Create session stripe
    //==============================================================
    const sessionPay = await stripe.checkout.sessions.create({
      //Configure session
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          name: experience.name,
          amount: finalAmout() * 100,
          currency: 'EUR',
          quantity: 1,
        },
      ],
      // payment_intent_data: {
      //   application_fee_amount: fee*100,
      //   transfer_data: {
      //     //Id beneficiario pago
      //  destination: item.postedBy.stripe_account_id,
      //   },
      // },
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    //==============================================================
    //Create booking
    //==============================================================
    const {
      user,
      date,
      hour,
      priceAdults,
      quantityAdults,
      priceKids,
      quantityKids,
      priceBabies,
      quantityBabies,
      totalPayAmount,
      paymentMethod,
      state,
    } = req.body.bookingDetails;

    const newBooking = new Booking({
      experience: experience._id,
      location: experience.address,
      date: moment(date, 'DD-MM-YYYY'),
      hour,

      user,
      hosted: experience.hosted,

      priceAdults: experience.ratesForPerson.adults,
      quantityAdults,
      priceKids: experience.ratesForPerson.kids,
      quantityKids,
      priceBabies: experience.ratesForPerson.babies,
      quantityBabies,
      totalPayAmount,

      paymentMethod,

      payTransactionResult: {
        id: sessionPay.payment_intent,
        status: sessionPay.status,
        update_time: '',
        email_address: user.email,
      },
    });
    // console.log('Newbooking', newBooking);
    const createdBooking = await newBooking.save();
    // const currentBooking = await experience.save();

    //==============================================================
    //Return response
    //==============================================================
    await User.findByIdAndUpdate(req.userBuyId, { stripeSession: sessionPay }).exec();

    console.log('sessión: ', sessionPay);

    //Return response
    res.status(200).json({ sessionId: sessionPay.id });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while try pay.',
    });
    next(err);
  }
});

module.exports = {
  getStripeSessionId,
};
