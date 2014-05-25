

	var   Class 		= require( "ee-class" )
		, type 			= require( "ee-types" )
		, log 			= require( "ee-log" )
		, ResourcePool	= require( "ee-resource-pool" )
		, url 			= require( "url" )
		, request 		= require( "request" );



	module.exports = new Class( {


		  maxConcurrent: 10000
		, maxConcurrentPerDomain: 10
		, maxWaiting: 1000000
		, maxWaitingPerDomain: 10000


		
		, init: function( options ){
			this.pools = [];

			if (!options) options = {};

			if ( type.number( options.maxConcurrent ) ) 				this.maxConcurrent = options.maxConcurrent;
			if ( type.number( options.maxConcurrentPerDomain ) ) 		this.maxConcurrentPerDomain = options.maxConcurrentPerDomain;
			if ( type.number( options.max ) ) 							this.maxConcurrent = options.max;
			if ( type.number( options.maxPerDomain ) ) 					this.maxConcurrentPerDomain = options.maxPerDomain;

			if ( type.number( options.maxWaitingRequests ) ) 			this.maxWaiting = options.maxWaitingRequests;
			if ( type.number( options.maxWaiting ) ) 					this.maxWaiting = options.maxWaiting;

			if ( type.number( options.maxWaitingRequestsPerDomain ) ) 	this.maxWaitingPerDomain = options.maxWaitingRequestsPerDomain;
			if ( type.number( options.maxWaitingPerDomain ) ) 			this.maxWaitingPerDomain = options.maxWaitingPerDomain;


			this.mainPool = new ResourcePool( {
				  max: 					this.maxConcurrent
				, maxWaitingRequests: 	this.maxWaiting
				, idle: 				60000 //1m
			} );

			this.mainPool.on( "resourceRequest", function( cb ){ cb( {} ) } );
		}



		, request: function( options, callback ){
			this.mainPool.get( function( err, resource ){
				if ( err ) callback( err );
				else {
					this._request( options, callback, resource );
				}
			}.bind( this ) );
		}



		, _request: function( options, callback, resource ){
			var host = url.parse( options.url || options.uri ).host;

			if ( !this.pools[ host ] ) {
				this.createPool( host );
			}

			// domain specific queueing
			this.pools[ host ].get( function( err, domainResource ){
				if ( err ){
					resource.freeResource()
					callback( err );
				}
				else {
					this.executeRequest( options, function( err, response, body ){
						domainResource.freeResource();
						resource.freeResource();

						callback( err, response, body );
					}.bind( this ) );
				}
			}.bind( this ) );
		}



		, executeRequest: function( options, callback ){
			request( options, callback );
		}



		, createPool: function( host ){
			this.pools[ host ] = new ResourcePool();

			this.pools[ host ] = new ResourcePool( {
				  max: 					this.maxConcurrentPerDomain
				, maxWaitingRequests: 	this.maxWaitingPerDomain
				, idle: 				60000 //1m
			} );

			// removed unused resource pools
			this.pools[ host ].on( "idle", function(){
				setTimeout( function(){
					if ( this.pools[ host ].freePercent === 100 ){
						delete this.pools[ host ];
					}
				}.bind( this ), 60000 );
			}.bind( this ) );

			this.pools[ host ].on( "resourceRequest", function( cb ){ cb( {} ) } );
		}
	} );