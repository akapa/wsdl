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

makeObject = function (name) {

};

requirejs(['underscore', 'wsconfig', 'makeObject'], function (_, wsconfig, make) {
	var service = wsconfig.service;
	console.log(service);
	var reqObj = service.factory.make('getEventsInRange');
	service.call('getEventsInRange', reqObj);
	var ev = service.factory.make('event');
	var test = {
		test1: true,
		multis: [1,2,3.5,Infinity],
		obj: _(ev).extend({
			amount: 10.5,
			description: 'fasza',
			id: 56,
			time: new Date(),
			type: 'xy'
		}),
		classify: function () { return 'testObject'; }
	};
	var testType = {
		type: 'testObject',
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
			'obj': 'event',
			'obj2': 'event'
		}
	};
	console.log(service.serializer.serialize(test, 'testObject', testType));
});