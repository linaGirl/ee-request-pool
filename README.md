# ee-request-pool

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-request-pool.svg)](https://greenkeeper.io/)

rate limited http requests using the (resuest)[https://npmjs.org/package/request] library

## installation

	npm install ee-request-pool


## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-request-pool.png?branch=master)](https://travis-ci.org/eventEmitter/ee-request-pool)


## usage

### consturctor

you may set some optional limits on the pool

#### example
	
	var RequestPool = require( "ee-resuest-pool" );


	var pool = new Pool( {
		  max: 					1000 	// max conccurent request, defaults to 10'000
		, maxPerDomain: 		10 		// max conccurent request per domain , defaults to 10
		, maxWaiting: 			10000 	// max waiting requests, defaults to 1'000'000
		, maxWaitingPerDomain: 	100 	// max waiting requests per domain, defaults to 10'000
	} );

### request

you may pass the options object for a [request](https://github.com/mikeal/request) and a callback to the request function

#### example

	pool.request({ 
		  url 		: 'http://whatever/user'
		, method 	: 'POST' 
	}, function(err, response, body) {

	});