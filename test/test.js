
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, http 			= require('http')
		, assert 		= require('assert');


	http.createServer(function(request, response){
		response.writeHead(200);
		setTimeout(response.end.bind(response), 200);
	}).listen(7892);


	var   RequestPool = require('../')
		, pool;



	describe('The RequestPool', function(){
		it('should not throw when instantiated', function(){
			pool = new RequestPool({  
				  max: 					5 	 	// max conccurent request, defaults to 10'000
				, maxPerDomain: 		10 		// max conccurent request per domain , defaults to 10
				, maxWaiting: 			10000 	// max waiting requests, defaults to 1'000'000
				, maxWaitingPerDomain: 	100 	// max waiting requests per domain, defaults to 10'000
			});
		});


		it('should not finish too fast', function(done){
			var   i  		= jobs = 100
				, completed = 0
				, started 	= Date.now();

			this.timeout(20000);

			while(i--) {
				pool.request({url: 'http://127.0.0.1:7892/'}, function(err, response, body) {
					if (err) done(err);
					else if (++completed === jobs) {
						assert((Date.now()-started) > 4000);
						done();
					}
				});
			}
		});
	});
	