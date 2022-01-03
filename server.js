const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
var fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = JSON.parse(fs.readFileSync(`${path.resolve()}/swagger.json`));

//Config for load .env files
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

//====================================================
//Create Server Express
//====================================================
const app = express();

//====================================================
//Config database
//====================================================
//Create connection database Mongo whit Mongoose
const connection = require('./services/connectionBD_Mongo.js');

//====================================================
//Config server
//====================================================
//Logger info request in terminal
app.use(morgan('dev'));

//Add cors to allow requests from other servers
app.use(cors());

//Analyses applications receiving data in json format
app.use(express.json());

//Encode req.body
app.use(express.urlencoded({ extended: true }));

//====================================================
//OpenAPI Swagger
//====================================================

app.use(
  '/api/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    swaggerOptions: {},
  })
);

//====================================================
//Config static files directory
//====================================================
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//====================================================
//Routers
//====================================================
// app.use('/api/uploads', uploadRouter);
// app.use('/api/users', userRouter);
// app.use('/api/experiences', experienceRouter);
// app.use('/api/bookings', bookingRouter);
// app.get('/api/config/paypal', (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
// });

app.use('/api/v1/upload', require('./routes/api/v1/upload.js'));
app.use('/api/v1/payments', require('./routes/api/v1/payments.js'));
app.use('/api/v1/experiences', require('./routes/api/v1/experiences.js'));
app.use('/api/v1/bookings', require('./routes/api/v1/bookings.js'));
app.use('/api/v1/users', require('./routes/api/v1/users.js'));

//====================================================
//Route Middleware
//====================================================
app.get('/', (req, res) => {
  res.send('Server is ready');
});

//====================================================
//Errors
//====================================================
// //Catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// //General Error handler
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   //Send the error message
//   res.status(err.status || 500).send({ message: err.message });
// });

//====================================================
//Run server
//====================================================
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Current environment: ${process.env.NODE_ENV}`);
});
