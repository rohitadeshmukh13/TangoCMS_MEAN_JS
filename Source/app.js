var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var app = express();

var mongoose= require('mongoose'),
_ = require('lodash');

busboyBodyParser = require('busboy-body-parser'),
app.use(busboyBodyParser());


require('./models/Users');
require('./models/Conferences');
require('./models/Papers');
require('./models/Reviews');



mongoose.connect('mongodb://localhost/tangodb');

var passport=require('passport');

require('./config/passport');

var routes = require('./routes/index');
var userroutes = require('./routes/userroutes');
var userpwdroutes = require('./routes/userpwdroutes');
var confroutes=require('./routes/conferenceroutes');
var paperroutes=require('./routes/paperroutes');
var reviewRoutes = require('./routes/reviews_r');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(passport.initialize());

app.use('/', routes);
app.use('/', userroutes);
app.use('/',userpwdroutes);
app.use('/',confroutes);
app.use('/',paperroutes);
app.use('/', reviewRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
