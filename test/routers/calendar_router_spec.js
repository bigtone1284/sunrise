var expect    = require('chai').expect,
    request   = require('request');

describe('calendar router', function() {

	var server;
  var baseURL = 'http://localhost:3000';

  describe('GET /calendars', function() {
		it('should return a status 401 if there is no access token', function(done) {
			request({	
				uri: baseURL + '/calendars',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(401);
  			done();
  		});
  	});
		it('should return a status 401 if the access token is not from google', function(done) {
			request({	
				uri: baseURL + '/calendars?access_token=random',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(401);
  			done();
  		});
  	});
  });

  describe('GET /calendars/:id/events', function() {
		it('should return a status 401 if there is no access token', function(done) {
			request({	
				uri: baseURL + '/calendars/anthony.defreitas@gmail.com/events',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(401);
  			done();
  		});
  	});
		it('should return a status 401 if the access token is not from google', function(done) {
			request({	
				uri: baseURL + '/calendars/anthony.defreitas@gmail.com/events?access_token=random',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(401);
  			done();
  		});
  	});
  });
});
