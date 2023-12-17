let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let ngrok = require('@ngrok/ngrok');

let indexRouter = require('./routes/index');
let productRouter = require('./routes/product');
let vendorRouter = require('./routes/vendor');
let warehouseRouter = require('./routes/warehouse');
let receivingRouter = require('./routes/receiving');
let stokRouter = require('./routes/stock');
let userRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'warehouse-app',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: null },
	}),
);

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', vendorRouter);
app.use('/', vendorRouter);
app.use('/', warehouseRouter);
app.use('/', receivingRouter);
app.use('/', stokRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.header(
		'Access-Control-Allow-Origin',
		'http://localhost:3000',
	); // Atau '*'
	res.header(
		'Access-Control-Allow-Methods',
		'GET, PUT, POST, DELETE',
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type',
	);
	next();
});

// Get your endpoint online
ngrok
	.connect({ addr: 3000, authtoken_from_env: true })
	.then((listener) =>
		console.log(
			`Ingress established at: ${listener.url()}`,
		),
	);

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error =
		req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
