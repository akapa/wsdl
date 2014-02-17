requirejs.config({
	paths: {
		'underscore': 'lib/underscore',
        'xml': 'lib/xml',
        'Library': 'lib/Library',
        'objTools': 'lib/objTools',
        'wsdl': '.'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});

requirejs(['underscore', 'wsdl/gen/wsconfig', 'xml'],
function (_, service, xml) {

	service.getEventsInRange({
				timeFrom: new Date('09/18/2013'),
				timeTo: new Date('11/02/2013')
			}, 
			function () { console.log(arguments); }, 
			function () { console.log(arguments); }
		);

	var user = service.factory.makeAndFill('user', {
		id: '11',
		name: 'Gipsz Jakab'
	});

	var ev = service.factory.makeAndFill('event', {
		amount: '10.5',
		description: 'This is a test',
		id: 56,
		time: new Date('08/31/96 12:55'),
		type: 'income',
		user: user
	});

	var ev2 = service.factory.makeAndFill('event', {
		amount: 29.11,
		description: 'Another one',
		id: 101,
		time: new Date('05/15/86 22:00'),
		type: 'income',
		user: null
	});

	var resp = service.factory.makeAndFill('getEventsInRangeResponse', {
		return: [ev, ev2]
	});

	var xmlresp = service.serializer.serialize(resp, 'getEventsInRangeResponse');
	document.getElementById('show').value = xml.formatString(xmlresp);

	var td = service.typeLibrary.getItem('getEventsInRangeResponse');
	console.log(td, service.serializer.unserialize(xmlresp, 'getEventsInRangeResponse', td));

	console.log(service.getSoapEnvelope(xmlresp));
	/*service.handleSuccess(
		'getEventsInRange',
		{
			status: 200,
			statusText: 'Fasza',
			responseText: service.getSoapEnvelope(xmlresp)
		},
		function () { console.log(arguments); }
	);*/
});
