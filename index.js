var application_root = __dirname,
    express          = require('express'),
    bodyParser       = require('body-parser'),
    path             = require('path'),
    logger           = require('morgan'),
    url							 = require('url')
    http 						 = require('http'),
    request					 = require('request'),
    session    			 = require('express-session');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(session({
	secret: 'secret',
  saveUninitialized: false,
  resave: false
}));
// authenticate routes

app.get('/authenticate', function(req, res) {
	var googleAuthPath = 'https://accounts.google.com/o/oauth2/auth';
	var googleQueryParams = [
		'?response_type=code',
		'client_id=690512789525-g8dbv0s1jo80u5hvevptqapeqokq7ees.apps.googleusercontent.com',
		'redirect_uri=http://localhost:3000/authenticate/callback',
		'scope=https://www.googleapis.com/auth/calendar.readonly'
	].join('&');
	var pathWithQueryParams = url.resolve(googleAuthPath, googleQueryParams);
	// need to add in the query parameters.  
	res.redirect(pathWithQueryParams);
});

app.get('/authenticate/callback', function(req, res) {
	req.session.code = req.query.code;
	var queryParams = {
		code: req.query.code,
		client_id: '690512789525-g8dbv0s1jo80u5hvevptqapeqokq7ees.apps.googleusercontent.com',
		client_secret: '4F1S-sDPZFjgztrJbwjZVTJj',
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:3000/authenticate/callback'
	};
	request({
		uri: 'https://www.googleapis.com/oauth2/v3/token',
		method: 'POST',
		qs: queryParams,
		json: true
	},
	function(error, response, body) {
		req.session.accessToken = body.access_token;
		console.log(body.access_token);
		res.send('You have successfully authenticated. You may go to /calendars?accessToken=' + req.session.accessToken + ' to get to see all your calendars');
	});
});

app.get('/test', function(req, res) {
	res.send(req.session.accessToken);
});

// calendar routes

app.get('/calendars', function(req, res) {
	var accessToken = req.query.accessToken
	console.log(accessToken);
	request({
		uri: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		method: 'GET',
		json: true,
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	}, function(error, response, body) {
		console.log(response);
		console.log(body);
		console.log(error);
		var calendars = body.items.map(function(calendar) {
			// Note: I have assumed that calendars with owner access are writable,
			// while calendars with reader access or other are not.  
			writable = calendar.accessRole === 'owner';
			return {
				id: calendar.id,
			  title: calendar.summary,
			  writable: writable,
			  selected:  calendar.selected,
			  timezone: calendar.timeZone
			}
		});
		res.send(calendars);
	});
});

app.get('/calendars/:id/events', function(req, res) {
	var accessToken = req.query.accessToken;
	request({
		uri: 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(req.params.id) + '/events',
		method: 'GET',
		json: true,
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	}, function(error, response, body) {
		var events = body.items.map(function(calendarEvent) {
			// Note: I have assumed that calendars with owner access are writable,
			// while calendars with reader access or other are not.  
			// Note: recurrence bug.  
			return {
				id: calendarEvent.id,
				status: calendarEvent.status,
				title: calendarEvent.summary,
				start: {
					dateTime: calendarEvent.start.dateTime,
					timezone: body.timeZone
				},
				end: {
					dateTime: calendarEvent.end.dateTime,
					timezone: body.timeZone
				},
				location: calendarEvent.location,
				attendees: calendarEvent.attendees,
				organizer: calendarEvent.organizer,
				editable: true,
				recurrence: calendarEvent.recurrence
			};
		});
		res.send(events);
	});
});

app.server = http.createServer(app);
app.server.listen(3000, function() {
  console.log('Listening on port 3000...');
});
