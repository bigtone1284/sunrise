var request				 = require('request'),
		express    		 = require('express'),
		// calendarList and eventList are modules I wrote to
		// organize the calendar and event information as
		// specified.  
		calendarList	 = require('../lib/calendar_list.js'),
		eventList			 = require('../lib/event_list.js')
		calendarRouter = express.Router();

// calendar routes

calendarRouter.get('/', function(req, res) {
	var accessToken = req.query.accessToken;
	request({
		uri: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		method: 'GET',
		json: true,
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	}, function(error, response, body) {
		if (body.error) {
			// send back any errors if they exist from the request to Google API.
			res.status(401)
				.send(body.error);
		} else {
			// The calendar list lives in an attribute called 'items' within body.  
			var calendars = calendarList(body.items);
			res.send(calendars);
		}
	});
});

calendarRouter.get('/:id/events', function(req, res) {
	var accessToken = req.query.accessToken;
	request({
		uri: 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(req.params.id) + '/events',
		method: 'GET',
		json: true,
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	}, function(error, response, body) {
		if (body.error) {
			// send back any errors if they exist from the request to Google API.
			res.status(401)
				.send(body.error);
		} else {
			// events also live within body.items, but timezone is found within body, not items.  
			var events = eventList(body);
			res.send(events);
		}
	});
});

// export this router as a module.  
module.exports = calendarRouter;
