var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars')
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
var getSaldo = require('./helpers/getSaldo');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var homeRouter = require('./routes/home');
var consultaRouter = require('./routes/consultar');
var comprarRouter = require('./routes/comprar');
var venderRouter = require('./routes/vender');
var historialRouter = require('./routes/historial');
var logoutRouter = require('./routes/logout');
var saldoRouter = require('./routes/saldo');
var usersRouter = require('./routes/users');
var app = express();

app.use(session({
  secret: 'adadadad',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id;
  next();
});

app.use(getSaldo);

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views')
}));
app.set('view engine', 'hbs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/home', homeRouter);
app.use('/consultar', consultaRouter);
app.use('/comprar', comprarRouter);
app.use('/vender', venderRouter);
app.use('/historial', historialRouter);
app.use('/logout', logoutRouter);
app.use('/', saldoRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
