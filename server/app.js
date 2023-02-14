const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const leaveRoutes = require('./routes/leaveRoutes');
// import leaveRoutes
const userRoutes = require('./routes/userRoutes');
// import userRoutes

const app = express();
// create an express app

app.set('view engine', 'pug');
// set the view engine to pug
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
//! Security Measurement
//? Set security HTTP headers
app.use(helmet());

//? Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//? Cors
app.use(cors(corsOptions));

//! Security Measurement
//?Limiting requests from same API
const limiter = rateLimit({
  max: 100, //no of requests
  windowMs: 60 * 60 * 1000, //window miliseconds
  // 100 requests per hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//! Security Measurement
//?Limiting invalid login attempts
const loginLimiter = rateLimit({
  max: 100, //no of requests
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many login attempts, please try again in an hour!',
});
app.post('/api/v1/users/login', loginLimiter);

//? Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//! Security Measurement
//body limit is to prevent DOS attacks (Denial of Service)

//! Security Measurement
//? Data sanitization against NoSQL query injection
app.use(mongoSanitize()); //removes $ and . from req.body object. Mongo operators are removed

//! Security Measurement
//? Data sanitization against XSS (cross site scripting)
app.use(xss()); //removes html tags from req.body object

//! Security Measurement
//?Prevent Parameter Pollution
app.use(hpp()); //remove duplicate fields in query string
//If you want to whitelist specific fields like this, hpp({whitelist: ['duration']})

//? Serving static files
app.use(express.static(`${__dirname}/public`));
//serves static files from public folder

//? Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/users', userRoutes);

//Handling unhandled routes
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
