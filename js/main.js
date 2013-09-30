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
	var reqObj = service.factory.make('GetEventsInRange');
	service.call('getEventsInRange', reqObj);
});