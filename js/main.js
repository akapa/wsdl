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

requirejs(['underscore', 'wsconfig', 'makeObject'], function (_, wsconfig, make) {
	var service = wsconfig.service;
	console.log(service);

	var reqObj = service.factory.make('getEventsInRange');
	service.call('getEventsInRange', reqObj);

	var user = make(service.factory.make('user'), {
		id: 11,
		name: 'Gipsz Jakab'
	});

	var ev = make(service.factory.make('event'), {
		amount: 10.5,
		description: 'This is a test',
		id: 56,
		time: new Date('05/05/76 13:35'),
		type: 'income',
		user: user
	});

	var ev2 = make(service.factory.make('event'), {
		amount: 29.11,
		description: 'Another one',
		id: 101,
		time: new Date('05/15/76 13:35'),
		type: 'income',
		user: user
	});

	var resp = make(service.factory.make('getEventsInRangeResponse'), {
		return: [
			ev,
			ev2
		]
	});

	//console.log(service.serializer.serialize(resp, 'getEventsInRangeResponse'));
});