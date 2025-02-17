var mysql = require('mysql');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash   = require('express-flash');
var logger = require('morgan');
var csrf   = require('csurf');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var adminsRouter = require('./routes/admins');
var app = express();
var config = require('./config.js');
const port = config.server.port;

//set database
const db = mysql.createConnection({
	host : config.database.host,
	user : config.database.user,
	password : config.database.pass,
	database : config.database.database,
  multipleStatements: true
});


db.connect(function(err){
	if(err){
		console.log("Database Not Connected");
		throw err;
	}else{
		console.log("Database is connected!");
	}
})

//export connection
global.db = db;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('nep'));

app.use(session({
  secret: 'nep',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 }
}));

app.use(flash());
var csrfProtection = csrf({ cookie: true })

app.use(csrf({ cookie: true }));

//Handle csrf get
app.get('*', function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
});
//Handle csrf post
app.post('*', function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
});

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // handle CSRF token errors here
  res.status(403)
  res.send("We couldn't detect the token of csrf.")
});


//app.use(express.static(path.join(__dirname, 'series')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', adminRouter);
app.use('/admins', adminsRouter);

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
  res.render('error');
});
app.listen(port, () => console.log("App listen in",port));

module.exports = app;
