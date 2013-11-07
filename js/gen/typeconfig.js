
define(['underscore', 'wsdl2/objTools', 'wsdl2/TypeLibrary', 'wsdl2/TypeDefinition', 'wsdl2/TypeEnsurer'], 
function (_, objTools, TypeLibrary, TypeDefinition, TypeEnsurer) {
	var namespaces = {
		0: 'http://budget.kapa.org/',
		'xs': 'http://www.w3.org/2001/XMLSchema'
	};

	//PROTO OBJECTS FOR XSD COMPLEX TYPES

	var objects = {
	
		'getRecentEvents': {
			classify: function () { return 'getRecentEvents'; }
		},
	
		'getRecentEventsResponse': {
			'return': [],
			classify: function () { return 'getRecentEventsResponse'; }
		},
	
		'event': {
			'amount': 0,
			'description': '',
			'id': 0,
			'time': null,
			'type': '',
			'user': null,
			classify: function () { return 'event'; }
		},
	
		'user': {
			'events': [],
			'id': 0,
			'name': '',
			classify: function () { return 'user'; }
		},
	
		'getEventsInRange': {
			'timeFrom': null,
			'timeTo': null,
			classify: function () { return 'getEventsInRange'; }
		},
	
		'getEventsInRangeResponse': {
			'return': [],
			classify: function () { return 'getEventsInRangeResponse'; }
		},
	
		'storeObjects': {
			'objects': [],
			classify: function () { return 'storeObjects'; }
		},
	
		'getAmount': {
			classify: function () { return 'getAmount'; }
		},
	
		'getAmountResponse': {
			'return': 0,
			classify: function () { return 'getAmountResponse'; }
		},
	
		'deleteObjects': {
			'objects': [],
			classify: function () { return 'deleteObjects'; }
		},
	
	};

	//TYPE DEFINITIONS FOR XSD COMPLEX TYPE

	var types = [
	
		objTools.make(TypeDefinition, {
			type: 'getRecentEvents',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetRecentEvents () {
				return objTools.construct(objects.getRecentEvents, GetRecentEvents);
			},
			properties: {
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'getRecentEventsResponse',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetRecentEventsResponse () {
				return objTools.construct(objects.getRecentEventsResponse, GetRecentEventsResponse);
			},
			properties: {
				'return': objTools.make(TypeDefinition, {
					multiple: true,
					complex: true,
					ns: 'http://budget.kapa.org/',
					type: 'event'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'event',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function Event () {
				return objTools.construct(objects.event, Event);
			},
			properties: {
				'amount': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'float'
				}),
				'description': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'string'
				}),
				'id': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'int'
				}),
				'time': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'dateTime'
				}),
				'type': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'string'
				}),
				'user': objTools.make(TypeDefinition, {
					complex: true,
					ns: 'http://budget.kapa.org/',
					type: 'user'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'user',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function User () {
				return objTools.construct(objects.user, User);
			},
			properties: {
				'events': objTools.make(TypeDefinition, {
					multiple: true,
					complex: true,
					ns: 'http://budget.kapa.org/',
					type: 'event'
				}),
				'id': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'int'
				}),
				'name': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'string'
				}),
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
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'dateTime'
				}),
				'timeTo': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'dateTime'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'getEventsInRangeResponse',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetEventsInRangeResponse () {
				return objTools.construct(objects.getEventsInRangeResponse, GetEventsInRangeResponse);
			},
			properties: {
				'return': objTools.make(TypeDefinition, {
					multiple: true,
					complex: true,
					ns: 'http://budget.kapa.org/',
					type: 'event'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'storeObjects',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function StoreObjects () {
				return objTools.construct(objects.storeObjects, StoreObjects);
			},
			properties: {
				'objects': objTools.make(TypeDefinition, {
					multiple: true,
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'anyType'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'getAmount',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetAmount () {
				return objTools.construct(objects.getAmount, GetAmount);
			},
			properties: {
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'getAmountResponse',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function GetAmountResponse () {
				return objTools.construct(objects.getAmountResponse, GetAmountResponse);
			},
			properties: {
				'return': objTools.make(TypeDefinition, {
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'int'
				}),
			}
		}),
	
		objTools.make(TypeDefinition, {
			type: 'deleteObjects',
			ns: namespaces[0],
			complex: true,
			constructorFunction: function DeleteObjects () {
				return objTools.construct(objects.deleteObjects, DeleteObjects);
			},
			properties: {
				'objects': objTools.make(TypeDefinition, {
					multiple: true,
					ns: 'http://www.w3.org/2001/XMLSchema',
					type: 'anyType'
				}),
			}
		}),
	
	];

	var tlib = new TypeLibrary(types);
	tlib.typeEnsurer = new TypeEnsurer(tlib);
	return tlib;
});
