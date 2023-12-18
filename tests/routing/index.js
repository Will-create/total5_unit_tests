/* eslint-disable */
require('../../total5/index');
require('../../total5/test');

// HTTP routing
// API routing
// WebSocket routing + WebSocketClient (text, json and binary communication)
// File routing
// Removing routess

// load web server and test app
F.http();


var url = 'http://0.0.0.0:8000';
var item = 'HELLO';
var item2 = 'hello2';
var item3 = 'hello3';
var items = [
	{ url: `/${item}/`, res: item },
	{ url: `/params/${item}/`, res: item },
	{ url: `/params/alias/${item}/`, res: item },
	{ url: `/params/is/inside/${item}/long/route/`, res: item },
	{ url: `/params/is/inside/${item}/long/route/alias/`, res: item },
	{ url: `/params/${item}/${item2}/${item3}/alias/`, res: item },
	{ url: `/params/${item}/${item2}/${item3}/first`, res: item },
	{ url: `/params/${item}/${item2}/${item3}/second/`, res: item2 },
	{ url: `/params/${item}/${item2}/${item3}/third/`, res: item3 }
];

var methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];




items.wait(function(item, next) {
	ROUTE('GET ' + item.url, function($) {
		$.plain(item.res);
	});
	next();

}, function() {
	console.log('Params test routes Registered successfully!');

	// Register methods
	methods.wait(function(method, next) {
		ROUTE(method + ' /methods/', function($) {
			$.success(true);
		});
		next();
	}, function() {
		console.log('Http Methods route registered successfully');
	});

});

ON('ready', function() {


	Test.push('Http Routes', function(next) {
		items.wait(function(item, n) {
			RESTBuilder.GET(url + item.url).exec(function(err, res, output) {
				res = output.response;
				Test.print('Routes - Params {0}'.format(item.url),  res !== item.res ?  'TEST {0} failed'.format(item.url) : null);
				n();
			});
		}, function() {
			next();
		});
	});


	Test.push('Http Methods', function(next) {

		methods.wait(function(method, n) {
			RESTBuilder[method](url + '/methods').exec(function(err, response, output) {
				Test.print('Methods - {0} /methods/'.format(method),  !response.success ?  'TEST {0} /methods/ failed'.format(method) : null);
				n();
			})
		}, function() {
			next()
		});
	});


	Test.push('RESTBuilder', function(next) {

		var arr = [];

		// HTML Page
		arr.push(function(next_fn) {
			RESTBuilder.GET('https://www.totaljs.com').exec(function(err, response) {
				Test.print('HTML Page', (err !== null) && (response !== EMPTYOBJECT) ? 'HTML Page loading failed' : null);
				next_fn();
			});
		});

		// Invalid path
		arr.push(function(next_fn) {
			RESTBuilder.GET('https://www.totaljs.com/helfo').exec(function(err) {
				Test.print('Invalid path - Test 1', err instanceof ErrorBuilder ? null : 'Expected Error Builder instance');
				next_fn();
			});
		});

		arr.sync(function() {
			next();
		})

		
		
	});

	setTimeout(function() {
		Test.run(function() {
			process.exit(0);
		});
	}, 3000);
});