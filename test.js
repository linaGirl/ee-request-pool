


	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, assert 		= require( "assert" );



	var RequestPool 	= require( "./" );



	var pool = new RequestPool( {
		maxConcurrent: 100
	} );


	var ids = [113462,113464,113465,113466,113467,113468,113469,113470,113471,113472,113473,113474,113475,113476,113477,113478,113479,113480,113481,113482,113483,113484,113485,113486,113487,113488,113489,113490]


	ids.forEach( function( id ){
		pool.request( { url: "http://events.ch/en/e-" + id }, function( err, response, body ){
			if ( err ) log.trace( err );
			else log.info( response.statusCode, body.length );
		} );
	} );