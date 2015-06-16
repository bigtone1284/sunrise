var expect    = require('chai').expect,
    request   = require('request');

describe('authenticate router', function() {

	var server;
  var baseURL = 'http://localhost:3000';

  describe('GET /authenticate', function() {
		it('should return a status 200', function(done) {
			request({	
				uri: baseURL + '/authenticate',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(200);
  			done();
  		});
  	});
  });
  describe('GET /authenticate/callback', function() {
  	it('should return a status 401 if it lacks a query parameter code', function(done) {
  		request({	
				uri: baseURL + '/authenticate/callback',
				method: 'GET'
  		},
  		function(error, response, body) {
  			console.log(response)
  			expect(response.statusCode).to.equal(401);
  			done();
  		});
  	});
  	it('should return a status 401 if the code does not come from google', function(done) {
  		request({	
				uri: baseURL + '/authenticate/callback?code=random',
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
