requirejs.config({
	paths: {
		'underscore': 'lib/underscore',
		'wsdl2': '.'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});

requirejs(['underscore', 'wsdl2/gen/wsconfig', 'wsdl2/Xml', 'wsdl2/XmlValidator'],
function (_, service, Xml, XmlValidator) {
	var xsd = document.getElementById('xsd').value;
	var validator = new XmlValidator();
	validator.loadXsd(Xml.parseXml(xsd));
	console.log(validator);

	console.log(service);

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

	var xml = service.serializer.serialize(resp, 'getEventsInRangeResponse');
	document.getElementById('show').innerText = Xml.format(xml);

	var dom = Xml.parseXml(xml);
	var validationResult = validator.validate(dom);
	console.log(validationResult);

	/*var td = service.typeLibrary.getItem('getEventsInRangeResponse');
	console.log(td, service.serializer.unserialize(xml, 'getEventsInRangeResponse', td));*/

	service.handleSuccess(
		'getEventsInRange',
		{
			status: 200,
			statusText: 'Fasza',
			responseText: service.getSoapEnvelope(xml)
		},
		function () { console.log(arguments); }
	);
});
