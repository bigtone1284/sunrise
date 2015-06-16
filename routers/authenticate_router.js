var url							 	 = require('url'),
	  request						 = require('request'),
		express 				   = require('express'),
		authenticateRouter = express.Router();

// authenticate routes

authenticateRouter.get('/', function(req, res) {
	// built up the path to get a code to request an access token from Google.  
	var googleAuthPath = 'https://accounts.google.com/o/oauth2/auth';
	// query params below are per Google Calendar API Docs.  
	var googleQueryParams = [
		'?response_type=code',
		'client_id=690512789525-g8dbv0s1jo80u5hvevptqapeqokq7ees.apps.googleusercontent.com',
		'redirect_uri=http://localhost:3000/authenticate/callback',
		'scope=https://www.googleapis.com/auth/calendar.readonly'
	].join('&');
	var pathWithQueryParams = url.resolve(googleAuthPath, googleQueryParams);
	// This sends users to Google in order to authenticate and grant this app permissions.
	res.redirect(pathWithQueryParams);
});

authenticateRouter.get('/callback', function(req, res) {
	// The callback should include a code from Google.  Else, users should authenticate.  
	if (req.query.code) {
		var queryParams = {
			code: req.query.code,
			client_id: '690512789525-g8dbv0s1jo80u5hvevptqapeqokq7ees.apps.googleusercontent.com',
			client_secret: '4F1S-sDPZFjgztrJbwjZVTJj',
			grant_type: 'authorization_code',
			redirect_uri: 'http://localhost:3000/authenticate/callback'
		};
		// This request sends the users code along with info about our app to get an Google access token.  
		request({
			uri: 'https://www.googleapis.com/oauth2/v3/token',
			method: 'POST',
			qs: queryParams,
			json: true
		},
		function(error, response, body) {
			if (body.error) {
				// This checks for errors sent to us from Google's permission page.  
				res.status(401)
					.send(body);
			} else {
				res.send('You have successfully authenticated. You may go to /calendars?accessToken=' + body.access_token + ' to get to see all your calendars');
			}
		});
	} else {
		// This checks for errors due to trying to access this route without a Google code.  
		res.status(401)
			.send('There has been an error.  Please authenticate again.');
	}
});

// Export this router as a module.  
module.exports = authenticateRouter;
