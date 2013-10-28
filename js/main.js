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

requirejs(['underscore', 'wsconfig', 'Xml'], function (_, wsconfig, Xml) {
	var service = wsconfig.service;
	console.log(service);

	var reqObj = service.factory.make('getEventsInRange');
	service.call('getEventsInRange', reqObj);

	var user = _.extend(service.factory.make('user'), {
		id: 11,
		name: 'Gipsz Jakab'
	});

	var ev = _.extend(service.factory.make('event'), {
		amount: 10.5,
		description: 'This is a test',
		id: 56,
		time: new Date('08/31/96 12:55'),
		type: 'income',
		user: user
	});

	var ev2 = _.extend(service.factory.make('event'), {
		amount: 29.11,
		description: 'Another one',
		id: 101,
		time: new Date('05/15/86 22:00'),
		type: 'income',
		user: null
	});

	var resp = _.extend(service.factory.make('getEventsInRangeResponse'), {
		return: [ev, ev2]
	});

	var xml = service.serializer.serialize(resp, 'getEventsInRangeResponse');
	document.getElementById('show').innerText = Xml.format(xml);

	var td = service.typeLibrary.getItem('getEventsInRangeResponse');
	console.log(td, service.serializer.unserialize(xml, 'getEventsInRangeResponse', td));
});
