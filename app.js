var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	routesIndex = require('./routes/index'),
	routesBlog = require('./routes/blog'),
	app = express();
// TODO var favicon = require('serve-favicon');

// View engine setup
// I use ejs cause it's very simple and gets the job done
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));

app.use('/', routesIndex);
app.use('/blog', routesBlog);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handlers

// Production error handler, no stacktraces leaked to user
app.use(function (err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
