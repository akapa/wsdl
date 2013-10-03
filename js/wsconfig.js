define(['underscore', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'SoapSerializer', 'Factory'], 
function (_, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, SoapSerializer, Factory) {
	var ns = 'http://budget.kapa.org';
	var url = 'Service';

	var objects = {
		event: {
			'amount': 0,
			'description': '',
			'id': 0,
			'time': new Date(),
			'type': '',
			'user': null,
			classify: function () { return 'event'; }
		},
		getEventsInRange: {
			'timeFrom': new Date(),
			'timeTo': new Date,
			classify: function () { return 'getEventsInRange'; }
		},
		getEventsInRangeResponse: {
			'return': [],
			classify: function () { return 'getEventsInRangeResponse'; }
		}
	};

	var types = [
		_(Object.create(TypeDefinition)).extend({
				type: 'event',
				ns: ns,
				complex: true,
				proto: objects.event,
				properties: {
					'amount': {
						type: 'float'
					},
					'description': {
						type: 'string'
					},
					'id': {
						type: 'int'
					},
					'time': {
						type: 'dateTime'
					},
					'type': {
						type: 'string'
					},
					'user': {
						type: 'User'
					}
				}
			}),
		_(Object.create(TypeDefinition)).extend({
				type: 'getEventsInRange',
				ns: ns,
				complex: true,
				proto: objects.getEventsInRange
			}),
		_(Object.create(TypeDefinition)).extend({
			type: 'getEventsInRangeResponse',
			ns: ns,
			complex: true,
			proto: objects.getEventsInRangeResponse
		})
	];

	var methods = [
		_(Object.create(MethodDefinition)).extend({
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
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