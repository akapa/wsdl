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
			'time': null,
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
			'timeFrom': null,
			'timeTo': null,
			classify: function () { return 'getEventsInRange'; }
		},
		getEventsInRangeResponse: {
			'return': [],
			classify: function () { return 'getEventsInRangeResponse'; }
		}
	};
	_(objects).each(function (obj) {
		_(obj).each(function (val, name) {
			if (!_(val).isFunction()) {
				var postfix = name[0].toUpperCase() + name.slice(1);
				obj['get' + postfix] = function () {
					return this[name];
				};
				obj['set' + postfix] = function (newValue) {
					this[name] = newValue;
				};
			}
		});
	});

	var types = [
		make(TypeDefinition, {
			type: 'event',
			ns: ns,
			complex: true,
			constructorFunction: function Event () {
				return Object.create(objects.event);
			},
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
			constructorFunction: function User () {
				return Object.create(objects.user);
			},
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
			constructorFunction: function GetEventsInRange () {
				return Object.create(objects.getEventsInRange);
			},
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
			constructorFunction: function GetEventsInRangeResponse () {
				return Object.create(objects.getEventsInRangeResponse);
			},
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

	var typeLib = new TypeLibrary(types);
	var methodLib = new MethodLibrary(methods);
	var factory = new Factory(typeLib);
	var serializer = new SoapSerializer(typeLib);
	var ws = new WebService(serializer, factory, methodLib, typeLib);
	_(ws).extend({
		'getEventsInRange': function (params, onSuccess, onError) {
			var reqObj = make(this.methodLibrary.getItem('getEventsInRange').requestObject, params);
			this.call('getEventsInRange', reqObj, onSuccess, onError);
		}
	});

	return {
		service: ws
	};
});