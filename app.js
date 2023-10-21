var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var dotenv = require('dotenv');
var cors = require('cors');
const emailScheduler = require('./utils/emailScheduler'); 
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter  = require('./routes/auth');
var errorHandler = require('./handlers/errorHandler');

var app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

const content = {
  subject: 'Scheduled Email Test',
  text: 'This is a test email after 1 minute.',
  html: '<strong>This is a test email sent after 1 minute.</strong>'
};

// This schedules an email to be sent 1 minute from now and every day after that
// (Change 'days' to 'weeks' or 'months' to test those intervals)
const job = emailScheduler.scheduleEmail('minutes', 3, 'manvir_heer@sfu.ca', content);
//console.log(job)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 30*60*1000
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/habit', habitRouter);

console.log(process.env.DATABASE)
mongoose.connect(process.env.DATABASE);
mongoose.connection.on('open', function (ref) { 
  console.log('Connected to mongo server.');
})



app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
