define(['underscore', 'objTools', 'WebService', 'TypeLibrary', 'TypeDefinition', 
	'MethodLibrary', 'MethodDefinition', 'XmlSerializer', 'Factory'], 
function (_, objTools, WebService, TypeLibrary, TypeDefinition, MethodLibrary, MethodDefinition, XmlSerializer, Factory) {
	var namespaces = {
		0: 'http://budget.kapa.org',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};
	var url = 'Service';

	//PROTO OBJECTS FOR XSD COMPLEX TYPES

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

	//TYPE DEFINITIONS FOR XSD COMPLEX TYPE

	var types = [
		objTools.make(TypeDefinition, {
			type: 'event',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function Event () {
				return objTools.construct(objects.event, Event);
			},
			properties: {
				'amount': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'float'
				}),
				'description': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'string'
				}),
				'id': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'int'
				}),
				'time': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'time'
				}),
				'type': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'string'
				}),
				'user': objTools.make(TypeDefinition, {
					ns: namespaces[0],
					complex: true,
					type: 'user'
				})
			}
		}),
		objTools.make(TypeDefinition, {
			type: 'user',
			ns: namespaces['tns'],
			complex: true,
			constructorFunction: function User () {
				return objTools.construct(objects.user, User);
			},
			properties: {
				'events': objTools.make(TypeDefinition, {
					ns: namespaces[0],
					type: 'event',
					multiple: true,
					complex: true
				}),
				'id': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'int'
				}),
				'name': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'string'
				})
			}
		}),
		objTools.make(TypeDefinition, {
			type: 'getEventsInRange',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetEventsInRange () {
				return objTools.construct(objects.getEventsInRange, GetEventsInRange);
			},
			properties: {
				'timeFrom': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'dateTime'
				}),
				'timeTo': objTools.make(TypeDefinition, {
					ns: namespaces['xs'],
					type: 'dateTime'
				})
			}
		}),
		objTools.make(TypeDefinition, {
			type: 'getEventsInRangeResponse',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function getEventsInRangeResponse () {
				return objTools.construct(objects.getEventsInRangeResponse, getEventsInRangeResponse);
			},
			properties: {
				'return': objTools.make(TypeDefinition, {
					ns: namespaces[0],
					complex: true,
					multiple: true,
					type: 'event'
				})
			}
		})
	];

	//initializing Type Library with the xsd types
	var typeLib = new TypeLibrary(types);

	//generating getters and setters for XSD proto objects
	/*_(objects).each(function (obj) {
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
	});*/

	//WSDL METHOD DEFINITIONS

	var methods = [
		objTools.make(MethodDefinition, {
			name: 'getEventsInRange',
			requestObject: 'getEventsInRange',
			responseObject: 'getEventsInRangeResponse',
			endpoint: url,
			namespaces: namespaces
		})
	];

	//initializing Method Library with wsdl methods
	var methodLib = new MethodLibrary(methods);

	//creating Factory and Serializer
	var factory = new Factory(typeLib);
	var serializer = new XmlSerializer(typeLib, factory, namespaces);

	//creating the Web Service
	var ws = new WebService(serializer, factory, methodLib, typeLib);

	//adding Web Service methods to easily call WSDL methods
	_(ws).extend({
		'getEventsInRange': function (params, onSuccess, onError) {
			var reqObj = objTools.make(this.methodLibrary.getItem('getEventsInRange').requestObject, params);
			this.call('getEventsInRange', reqObj, onSuccess, onError);
		}
	});

	return {
		service: ws
	};
});