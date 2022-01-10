const { JsonWebTokenError } = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailSignUp = (user) => {
  console.log('user', user.email);
  sgMail
    .send({
      to: user.email, //recipient
      from: 'pablopsdigital@gmail.com', //verified sender
      subject: 'Welcome gomyecotrip',
      text: 'Welcome gomyecotrip',
      html: '<h1>Welcome to gomyecotrip.com</h1><p>The largest community of people who love to travel, with a focus on sustainable values and care for the environment.</p>',
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

// const transport = nodemailer.createTransport(
//   nodemailerSendgrid({
//     apiKey: process.env.SENDGRID_API_KEY,
//   })
// );

// const sendEmailSignUp = async (user) => {
//   transport
//     .sendMail({
//       from: 'booking@gomyecotrip.com',
//       to: `${user.firstName} <${user.email}>`,
//       subject: 'Welcomen to gomyecotrip.com',
//       html: `<h1>Hello, welcome to gomyecotrip!</h1>`,
//     })
//     .then(() => {
//       console.log('Email send');
//     })
//     .catch((error) => {
//       console.log('Email error: ', error);
//     });
// };

module.exports = { sendEmailSignUp };
