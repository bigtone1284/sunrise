var application_root = __dirname,
    express          = require('express'),
    bodyParser       = require('body-parser'),
    path             = require('path'),
    logger           = require('morgan');

var app = express();

// authenticate routes

app.get('/authenticate', function(req, res) {
	res.send('authenticate');
});

app.get('/authenticate/callback', function(req, res) {
	res.send('authenticate/callback');
});

// calendar routes

app.get('/calendars', function(req, res) {
	var queryParams = req.query;
	res.send(queryParams);
});

app.get('/calendars/:id/events', function(req, res) {
	var queryParams = req.query;
	res.send(queryParams);
});

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});
