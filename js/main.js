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
	var test = {
		test1: true,
		multis: [1,2,3.5,Infinity],
		obj: null
	};
	var testType = {
		type: 'TestObject',
		multiple: false,
		complex: true,
		properties: {
			'test1': {
				type: 'boolean'
			},
			'multis': {
				type: 'float',
				multiple: true
			},
			'obj': 'Event'
		}
	};
	console.log(service.serializer.serialize(test, testType, 'testObject'));
});