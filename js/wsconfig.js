define(['underscore', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'SoapSerializer'], 
function (_, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, SoapSerializer) {
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
		_(TypeDefinition).extend({
				type: 'event',
				ns: ns,
				complex: true,
				proto: objects.Event
			}),
		_(TypeDefinition).extend({
				type: 'getEventsInRange',
				ns: ns,
				complex: true,
				proto: objects.GetEventsInRange
			}),
		_(TypeDefinition).extend({
			type: 'getEventsInRangeResponse',
			ns: ns,
			complex: true,
			proto: objects.GetEventsInRangeResponse
		})
	];

	var methods = [
		_(MethodDefinition).extend({
			name: 'getEventsInRange',
			requestObj: objects.getEventsInRange,
			responseObj: objects.getEventsInRangeResponse,
			endpoint: url
		})
	];

	var typeLib = Object.create(TypeLibrary).init(types);
	var methodLib = Object.create(MethodLibrary).init(methods);
	var serializer = Object.create(SoapSerializer).init(typeLib);
	var ws = _(WebService).extend({
		'getEventsInRange': function () {

		}
	}).init(serializer, methodLib, typeLib);

	return {
		service: ws,
		objects: objects,
		typeLib: typeLib,
		methodLib: methodLib
	};
});