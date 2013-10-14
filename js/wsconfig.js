define(['underscore', 'makeObject', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'SoapSerializer', 'Factory'], 
function (_, make, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, SoapSerializer, Factory) {
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
		make(TypeDefinition, {
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
		make(TypeDefinition, {
			type: 'getEventsInRange',
			ns: ns,
			complex: true,
			proto: objects.getEventsInRange
		}),
		make(TypeDefinition, {
			type: 'getEventsInRangeResponse',
			ns: ns,
			complex: true,
			proto: objects.getEventsInRangeResponse
		})
	];

	var methods = [
		make(MethodDefinition, {
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
			endpoint: url
		})
	];

	var typeLib = make(TypeLibrary).init(types);
	var methodLib = make(MethodLibrary).init(methods);
	var factory = make(Factory).init(typeLib);
	var serializer = make(SoapSerializer).init(typeLib);
	var ws = make(WebService, {
		'getEventsInRange': function (params, onSuccess, onError) {

		}
	}).init(serializer, factory, methodLib, typeLib);

	return {
		service: ws
	};
});