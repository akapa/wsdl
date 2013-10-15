define(['underscore', 'makeObject', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'SoapSerializer', 'Factory'], 
function (_, make, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, SoapSerializer, Factory) {
	var ns = 'http://budget.kapa.org';
	var schemaNs = 'http://www.w3.org/2001/XMLSchema';
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
		user: {
			'events': [],
			'id': 0,
			'name': '',
			classify: function () { return 'user'; }
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
				'amount': make(TypeDefinition, {
					ns: schemaNs,
					type: 'float'
				}),
				'description': make(TypeDefinition, {
					ns: schemaNs,
					type: 'string'
				}),
				'id': make(TypeDefinition, {
					ns: schemaNs,
					type: 'int'
				}),
				'time': make(TypeDefinition, {
					ns: schemaNs,
					type: 'dateTime'
				}),
				'type': make(TypeDefinition, {
					ns: schemaNs,
					type: 'string'
				}),
				'user': make(TypeDefinition, {
					ns: ns,
					complex: true,
					type: 'user'
				})
			}
		}),
		make(TypeDefinition, {
			type: 'user',
			ns: ns,
			complex: true,
			proto: objects.user,
			properties: {
				'events': make(TypeDefinition, {
					ns: ns,
					type: 'event',
					multiple: true,
					complex: true
				}),
				'id': make(TypeDefinition, {
					ns: schemaNs,
					type: 'int'
				}),
				'name': make(TypeDefinition, {
					ns: schemaNs,
					type: 'string'
				})
			}
		}),
		make(TypeDefinition, {
			type: 'getEventsInRange',
			ns: ns,
			complex: true,
			proto: objects.getEventsInRange,
			properties: {
				'timeFrom': make(TypeDefinition, {
					ns: schemaNs,
					type: 'dateTime'
				}),
				'timeTo': make(TypeDefinition, {
					ns: schemaNs,
					type: 'dateTime'
				})
			}
		}),
		make(TypeDefinition, {
			type: 'getEventsInRangeResponse',
			ns: ns,
			complex: true,
			proto: objects.getEventsInRangeResponse,
			properties: {
				'return': make(TypeDefinition, {
					ns: ns,
					complex: true,
					multiple: true,
					type: 'event'
				})
			}
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