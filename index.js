var application_root 		= __dirname,
    express          		= require('express'),
    bodyParser       		= require('body-parser'),
    logger           		= require('morgan'),
    http						 		= require('http'),
    authenticateRouter  = require('./routers/authenticate_router.js'),
    calendarRouter			= require('./routers/calendar_router.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Separated authenticate and calendar routes in separate router files.
app.use('/authenticate', authenticateRouter);
app.use('/calendars', calendarRouter);

app.server = http.createServer(app);
app.server.listen(3000, function() {
  console.log('Listening on port 3000...');
});

// Export app as module
module.exports = app;
