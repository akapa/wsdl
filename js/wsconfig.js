define(['underscore', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'SoapSerializer', 'Factory'], 
function (_, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, SoapSerializer, Factory) {
	var ns = 'http://budget.kapa.org';
	var url = 'Service';

	var objects = {
		Event: {
			'amount': 0,
			'description': '',
			'id': 0,
			'time': new Date(),
			'type': '',
			'user': null
		},
		GetEventsInRange: {
			'timeFrom': new Date(),
			'timeTo': new Date
		},
		GetEventsInRangeResponse: {
			'return': []
		}
	};

	var types = [
		_(Object.create(TypeDefinition)).extend({
				type: 'Event',
				ns: ns,
				complex: true,
				proto: objects.Event
			}),
		_(Object.create(TypeDefinition)).extend({
				type: 'GetEventsInRange',
				ns: ns,
				complex: true,
				proto: objects.GetEventsInRange
			}),
		_(Object.create(TypeDefinition)).extend({
			type: 'GetEventsInRangeResponse',
			ns: ns,
			complex: true,
			proto: objects.GetEventsInRangeResponse
		})
	];

	var methods = [
		_(Object.create(MethodDefinition)).extend({
			name: 'getEventsInRange',
			requestObject: 'GetEventsInRange',
			responseObject: 'GetEventsInRangeResponse',
			endpoint: url
		})
	];

	var typeLib = Object.create(TypeLibrary).init(types);
	var methodLib = Object.create(MethodLibrary).init(methods);
	var factory = Object.create(Factory).init(typeLib);
	var serializer = Object.create(SoapSerializer).init(typeLib);
	var ws = _(Object.create(WebService)).extend({
		'getEventsInRange': function (params, onSuccess, onError) {

		}
	}).init(serializer, factory, methodLib, typeLib);

	return {
		service: ws
	};
});