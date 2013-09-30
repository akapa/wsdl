requirejs.config({
	paths: {
		'underscore': 'lib/underscore'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});

requirejs(['underscore', 'wsconfig'], function (_, wsconfig) {
	var service = wsconfig.service;
	console.log(service);
	var event = service.factory.make('Event');
	console.log(event);
});